#![cfg(test)]

use crate::{RealWorldAssetContract, RealWorldAssetContractClient, AssetMetadata, ComplianceData};
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, String, Vec, Bytes,
    xdr::{AccountId, Asset, AlphaNum4, AssetCode4, PublicKey, Uint256, Limits, WriteXdr},
    token::{TokenClient, StellarAssetClient},
};

fn create_test_asset_metadata() -> AssetMetadata {
    AssetMetadata {
        name: String::from_str(&Env::default(), "Luxury Apartment NYC"),
        symbol: String::from_str(&Env::default(), "NYC001"),
        description: String::from_str(&Env::default(), "Tokenized luxury apartment in Manhattan"),
        asset_type: String::from_str(&Env::default(), "real_estate"),
        legal_doc_hash: String::from_str(&Env::default(), "QmX9Y8Z..."), // IPFS hash
        valuation: 1_000_000_0000000, // $1M with 7 decimals
        last_valuation_date: 1640995200, // Jan 1, 2022
    }
}

fn create_test_compliance() -> ComplianceData {
    ComplianceData {
        kyc_verified: true,
        accredited_investor: true,
        jurisdiction: String::from_str(&Env::default(), "US"),
        compliance_expiry: 1735689600, // Jan 1, 2025
    }
}

fn create_serialized_asset(env: &Env) -> Bytes {
    let asset_code = AssetCode4(*b"NYC1"); // 4-byte asset code
    
    // Test issuer key
    let public_key_bytes: [u8; 32] = stellar_strkey::ed25519::PublicKey::from_string(
        "GCMPPXWUJGFPFXOMH3LUCBGFBTQMIOI7VDXZH6JTV64JLUYVHQV5M7VC"
    )
    .unwrap()
    .0;
    
    let issuer = AccountId(PublicKey::PublicKeyTypeEd25519(Uint256(public_key_bytes)));
    
    let alpha_num4 = AlphaNum4 {
        asset_code,
        issuer,
    };

    let asset = Asset::CreditAlphanum4(alpha_num4);
    let serialized: Vec<u8> = asset.to_xdr(Limits::none()).expect("serialization failed");
    
    Bytes::from_slice(env, &serialized)
}

#[test]
fn test_rwa_initialization() {
    let env = Env::default();
    let contract_id = env.register(RealWorldAssetContract, ());
    let client = RealWorldAssetContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let metadata = create_test_asset_metadata();
    let serialized_asset = create_serialized_asset(&env);

    // Deploy asset contract first
    let asset_address = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "deploy_asset_contract",
                args: (serialized_asset.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .deploy_asset_contract(&serialized_asset);

    // Initialize the RWA contract
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(), metadata.clone(), 1000_0000000i128, asset_address).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin, &metadata, &1000_0000000i128, &asset_address);

    // Verify initialization
    assert_eq!(client.get_admin(), admin);
    assert_eq!(client.get_total_supply(), 1000_0000000i128);
    assert_eq!(client.get_metadata().name, metadata.name);
    assert!(!client.is_paused());
}

#[test]
fn test_compliance_and_whitelist() {
    let env = Env::default();
    let contract_id = env.register(RealWorldAssetContract, ());
    let client = RealWorldAssetContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let metadata = create_test_asset_metadata();
    let compliance = create_test_compliance();
    let serialized_asset = create_serialized_asset(&env);

    // Deploy and initialize
    let asset_address = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "deploy_asset_contract",
                args: (serialized_asset.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .deploy_asset_contract(&serialized_asset);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(), metadata, 0i128, asset_address).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin, &metadata, &0i128, &asset_address);

    // Add compliance data
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "add_compliance",
                args: (user.clone(), compliance.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .add_compliance(&user, &compliance);

    // Add to whitelist
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "add_to_whitelist",
                args: (user.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .add_to_whitelist(&user);

    // Verify compliance and whitelist
    let stored_compliance = client.get_compliance(&user).unwrap();
    assert_eq!(stored_compliance.kyc_verified, true);
    assert_eq!(stored_compliance.accredited_investor, true);
    assert!(client.is_whitelisted(&user));
}

#[test]
fn test_minting_and_burning() {
    let env = Env::default();
    let contract_id = env.register(RealWorldAssetContract, ());
    let client = RealWorldAssetContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let metadata = create_test_asset_metadata();
    let compliance = create_test_compliance();
    let serialized_asset = create_serialized_asset(&env);

    // Deploy and initialize
    let asset_address = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "deploy_asset_contract",
                args: (serialized_asset.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .deploy_asset_contract(&serialized_asset);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(), metadata, 0i128, asset_address.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin, &metadata, &0i128, &asset_address);

    // Setup compliance and whitelist
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "add_compliance",
                args: (user.clone(), compliance).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .add_compliance(&user, &compliance);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "add_to_whitelist",
                args: (user.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .add_to_whitelist(&user);

    // Mint tokens
    let mint_amount = 100_0000000i128; // 100 tokens
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "mint",
                args: (user.clone(), mint_amount).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .mint(&user, &mint_amount);

    // Verify total supply increased
    assert_eq!(client.get_total_supply(), mint_amount);

    // Burn tokens
    let burn_amount = 50_0000000i128; // 50 tokens
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "burn",
                args: (user.clone(), burn_amount).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .burn(&user, &burn_amount);

    // Verify total supply decreased
    assert_eq!(client.get_total_supply(), mint_amount - burn_amount);
}

#[test]
fn test_valuation_update() {
    let env = Env::default();
    let contract_id = env.register(RealWorldAssetContract, ());
    let client = RealWorldAssetContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let metadata = create_test_asset_metadata();
    let serialized_asset = create_serialized_asset(&env);

    // Deploy and initialize
    let asset_address = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "deploy_asset_contract",
                args: (serialized_asset.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .deploy_asset_contract(&serialized_asset);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(), metadata, 0i128, asset_address).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin, &metadata, &0i128, &asset_address);

    // Update valuation
    let new_valuation = 1_200_000_0000000i128; // $1.2M
    let timestamp = 1672531200u64; // Jan 1, 2023

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "update_valuation",
                args: (new_valuation, timestamp).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .update_valuation(&new_valuation, &timestamp);

    // Verify valuation update
    let updated_metadata = client.get_metadata();
    assert_eq!(updated_metadata.valuation, new_valuation);
    assert_eq!(updated_metadata.last_valuation_date, timestamp);
}

#[test]
fn test_pause_functionality() {
    let env = Env::default();
    let contract_id = env.register(RealWorldAssetContract, ());
    let client = RealWorldAssetContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let metadata = create_test_asset_metadata();
    let serialized_asset = create_serialized_asset(&env);

    // Deploy and initialize
    let asset_address = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "deploy_asset_contract",
                args: (serialized_asset.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .deploy_asset_contract(&serialized_asset);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(), metadata, 0i128, asset_address).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin, &metadata, &0i128, &asset_address);

    // Pause contract
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "set_paused",
                args: (true,).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .set_paused(&true);

    // Verify contract is paused
    assert!(client.is_paused());

    // Unpause contract
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "set_paused",
                args: (false,).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .set_paused(&false);

    // Verify contract is not paused
    assert!(!client.is_paused());
}