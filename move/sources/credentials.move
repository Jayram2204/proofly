module proofly::credentials {
    use aptos_std::table::{Self, Table};
    use std::signer;
    use std::string::{Self, String};

    /// Per-account registry of anchored certificate hashes.
    struct Store has key {
        hashes: Table<String, address>,
    }

    const E_HASH_ALREADY_ANCHORED: u64 = 1;
    const E_INVALID_HASH: u64 = 2;

    /// Anchor a certificate's SHA-256 hash under the caller's account.
    /// An account can only anchor each hash once.
    public entry fun anchor_hash(owner: &signer, hash: String) acquires Store {
        let addr = signer::address_of(owner);

        assert!(string::length(&hash) == 64, E_INVALID_HASH);

        if (!exists<Store>(addr)) {
            move_to(owner, Store {
                hashes: table::new(),
            });
        }

        let store = borrow_global_mut<Store>(addr);
        assert!(!table::contains(&store.hashes, &hash), E_HASH_ALREADY_ANCHORED);
        table::add(&mut store.hashes, hash, addr);
    }

    /// Returns true when `hash` has been anchored by `owner`.
    #[view]
    public fun has_hash(owner: address, hash: String): bool acquires Store {
        if (!exists<Store>(owner)) {
            return false;
        }
        let store = borrow_global<Store>(owner);
        table::contains(&store.hashes, &hash)
    }
}
