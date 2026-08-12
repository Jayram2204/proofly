import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const COLORS = ['#3b5bff', '#7c3aed', '#22d3ee'];

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const el = mount;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080a12');

    const camera = new THREE.PerspectiveCamera(
      60,
      el.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, mount.clientHeight);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ----- Particle field -----
    const particleCount = 1100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      const color = new THREE.Color(
        COLORS[Math.floor(Math.random() * COLORS.length)],
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    // ----- Floating credential cubes -----
    const cubes: THREE.Mesh[] = [];
    const cubeDefs = [
      { x: -3.4, y: 1.6, z: -1, size: 0.9, speed: 0.7 },
      { x: 3.2, y: -1.4, z: -1.5, size: 0.7, speed: 0.55 },
      { x: 2.6, y: 2.0, z: -2.5, size: 0.55, speed: 0.8 },
      { x: -2.4, y: -1.9, z: -2, size: 0.6, speed: 0.65 },
    ];

    const light = new THREE.AmbientLight('#ffffff', 0.55);
    scene.add(light);
    const keyLight = new THREE.PointLight('#3b5bff', 1.4, 20);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight('#7c3aed', 1.1, 20);
    rimLight.position.set(-3, -2, 3);
    scene.add(rimLight);

    for (const def of cubeDefs) {
      const geometry = new THREE.BoxGeometry(
        def.size,
        def.size,
        def.size,
        1,
        1,
        1,
      );
      const material = new THREE.MeshStandardMaterial({
        color: '#141a2e',
        metalness: 0.35,
        roughness: 0.25,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(def.x, def.y, def.z);

      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: '#4f6bff',
        transparent: true,
        opacity: 0.75,
      });
      const wireframe = new THREE.LineSegments(edges, edgeMaterial);
      mesh.add(wireframe);

      mesh.userData = {
        baseY: def.y,
        speed: def.speed,
        rotSpeed: def.speed * 0.5,
      };
      group.add(mesh);
      cubes.push(mesh);
    }

    // ----- Animation -----
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };
    const rendererRef: { current: number | null } = { current: null };

    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function onResize() {
      const width = el.clientWidth;
      const height = el.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function animate() {
      const elapsed = clock.getElapsedTime();

      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.02) * 0.05;

      for (const cube of cubes) {
        const { baseY, speed, rotSpeed } = cube.userData as {
          baseY: number;
          speed: number;
          rotSpeed: number;
        };
        cube.position.y = baseY + Math.sin(elapsed * speed) * 0.4;
        cube.rotation.x = elapsed * rotSpeed;
        cube.rotation.y = elapsed * rotSpeed * 1.3;
        cube.rotation.z = elapsed * rotSpeed * 0.6;
      }

      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rendererRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    if (!reducedMotion) {
      rendererRef.current = requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      if (rendererRef.current !== null) {
        cancelAnimationFrame(rendererRef.current);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      for (const cube of cubes) {
        cube.children.forEach((child) => {
          if (child instanceof THREE.LineSegments) {
            (child.geometry as THREE.BufferGeometry).dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        (cube.geometry as THREE.BufferGeometry).dispose();
        (cube.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-scene" aria-hidden />;
}
