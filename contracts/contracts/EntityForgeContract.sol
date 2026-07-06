// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EntityForge Contract
 * @notice Entity-to-entity contracting protocol.
 *         Two autonomous entities can propose, negotiate, sign, fulfill,
 *         and verify work agreements — entirely on-chain, no humans.
 */
contract EntityForgeContract {
    enum ContractStatus { Proposed, Signed, Fulfilled, Verified, Terminated }

    struct AgentContract {
        bytes32 contractId;
        uint256 providerEntityId;
        uint256 buyerEntityId;
        bytes32 deliverableHash;  // keccak256 of spec document
        uint256 price;            // in wei (OKB on X Layer)
        uint256 deadline;         // block.timestamp
        bytes providerSig;        // EIP-712 signature
        bytes buyerSig;           // EIP-712 signature
        ContractStatus status;
        uint256 createdAt;
        uint256 fulfilledAt;
        uint256 verifiedAt;
    }

    mapping(bytes32 => AgentContract) public contracts;
    uint256 public contractCount;

    event ContractProposed(
        bytes32 indexed contractId,
        uint256 provider,
        uint256 buyer,
        uint256 price
    );
    event ContractSigned(bytes32 indexed contractId);
    event ContractFulfilled(bytes32 indexed contractId, bytes32 deliverableHash);
    event ContractVerified(bytes32 indexed contractId);
    event ContractTerminated(bytes32 indexed contractId, string reason);

    /**
     * @notice Propose a new contract between two entities
     * @param providerEntityId Entity that will do the work
     * @param deliverableHash keccak256 of the spec document
     * @param price Payment amount in wei
     * @param deadline Block timestamp by which work must be delivered
     * @return contractId Unique contract identifier
     */
    function propose(
        uint256 providerEntityId,
        uint256 buyerEntityId,
        bytes32 deliverableHash,
        uint256 price,
        uint256 deadline
    ) external returns (bytes32 contractId) {
        require(providerEntityId > 0, "Provider required");
        require(buyerEntityId > 0, "Buyer required");
        require(deliverableHash != bytes32(0), "Deliverable required");
        require(price > 0, "Price required");
        require(deadline > block.timestamp, "Deadline must be future");

        contractId = keccak256(
            abi.encodePacked(
                providerEntityId,
                buyerEntityId,
                deliverableHash,
                price,
                deadline,
                block.timestamp,
                ++contractCount
            )
        );

        contracts[contractId] = AgentContract({
            contractId: contractId,
            providerEntityId: providerEntityId,
            buyerEntityId: buyerEntityId,
            deliverableHash: deliverableHash,
            price: price,
            deadline: deadline,
            providerSig: "",
            buyerSig: "",
            status: ContractStatus.Proposed,
            createdAt: block.timestamp,
            fulfilledAt: 0,
            verifiedAt: 0
        });

        emit ContractProposed(contractId, providerEntityId, buyerEntityId, price);
    }

    /**
     * @notice Sign a proposed contract (called by provider AFTER negotiation)
     * @param contractId Contract to sign
     * @param signature EIP-712 signature from the provider entity
     */
    function sign(bytes32 contractId, bytes calldata signature) external {
        require(contracts[contractId].contractId == contractId, "Contract not found");
        require(
            contracts[contractId].status == ContractStatus.Proposed,
            "Not in proposed state"
        );
        require(signature.length > 0, "Signature required");

        contracts[contractId].providerSig = signature;
        contracts[contractId].status = ContractStatus.Signed;

        emit ContractSigned(contractId);
    }

    /**
     * @notice Fulfill a signed contract by delivering the work
     * @param contractId Contract being fulfilled
     * @param deliveredHash keccak256 of the actual delivered work
     */
    function fulfill(bytes32 contractId, bytes32 deliveredHash) external {
        require(contracts[contractId].contractId == contractId, "Contract not found");
        require(
            contracts[contractId].status == ContractStatus.Signed,
            "Not signed"
        );
        require(deliveredHash != bytes32(0), "Deliverable required");

        contracts[contractId].deliverableHash = deliveredHash;
        contracts[contractId].status = ContractStatus.Fulfilled;
        contracts[contractId].fulfilledAt = block.timestamp;

        emit ContractFulfilled(contractId, deliveredHash);
    }

    /**
     * @notice Verify a fulfilled contract and release payment
     */
    function verify(bytes32 contractId) external {
        require(contracts[contractId].contractId == contractId, "Contract not found");
        require(
            contracts[contractId].status == ContractStatus.Fulfilled,
            "Not fulfilled"
        );

        contracts[contractId].status = ContractStatus.Verified;
        contracts[contractId].verifiedAt = block.timestamp;

        emit ContractVerified(contractId);
    }

    /**
     * @notice Terminate a contract (before fulfillment)
     */
    function terminate(bytes32 contractId, string calldata reason) external {
        require(contracts[contractId].contractId == contractId, "Contract not found");
        require(
            contracts[contractId].status == ContractStatus.Proposed ||
            contracts[contractId].status == ContractStatus.Signed,
            "Cannot terminate in current state"
        );

        contracts[contractId].status = ContractStatus.Terminated;

        emit ContractTerminated(contractId, reason);
    }

    /**
     * @notice Get contract details
     */
    function getContract(bytes32 contractId) external view returns (AgentContract memory) {
        return contracts[contractId];
    }
}
