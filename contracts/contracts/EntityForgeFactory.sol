// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EntityForge Factory
 * @notice Forms and registers Autonomous Economic Entities on X Layer.
 *         Every entity gets a unique ID, name, constitution hash, and founder.
 *         Entities are permanent on-chain records. They survive any single task.
 */
contract EntityForgeFactory {
    uint256 public entityCount;

    enum EntityStatus { Formation, Active, Dissolved, Merged }

    struct Entity {
        uint256 id;
        string name;
        address entityWallet;
        bytes32 constitutionHash;
        uint256 formedAt;
        EntityStatus status;
    }

    mapping(uint256 => Entity) public entities;
    mapping(address => uint256[]) public founderEntities;

    event EntityFormed(
        uint256 indexed entityId,
        string name,
        address indexed founder,
        bytes32 constitutionHash
    );
    event EntityDissolved(uint256 indexed entityId);

    /**
     * @notice Form a new Autonomous Economic Entity
     * @param name Human-readable entity name (e.g. "Atlas Analytics")
     * @param constitutionHash keccak256 of all constitutional laws
     * @param founder Address of the founding agent/principal
     * @return entityId Unique entity identifier
     */
    function formEntity(
        string calldata name,
        bytes32 constitutionHash,
        address founder
    ) external returns (uint256 entityId) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(name).length <= 64, "Name too long");
        require(constitutionHash != bytes32(0), "Constitution required");
        require(founder != address(0), "Founder required");

        entityId = ++entityCount;

        entities[entityId] = Entity({
            id: entityId,
            name: name,
            entityWallet: address(0), // Set after vault deployment
            constitutionHash: constitutionHash,
            formedAt: block.timestamp,
            status: EntityStatus.Formation
        });

        founderEntities[founder].push(entityId);

        emit EntityFormed(entityId, name, founder, constitutionHash);
    }

    /**
     * @notice Link a vault to an existing entity (called by vault deployer)
     */
    function linkVault(uint256 entityId, address vault) external {
        require(entities[entityId].id == entityId, "Entity not found");
        require(entities[entityId].entityWallet == address(0), "Vault already linked");
        entities[entityId].entityWallet = vault;
        entities[entityId].status = EntityStatus.Active;
    }

    /**
     * @notice Dissolve an entity
     */
    function dissolveEntity(uint256 entityId) external {
        require(entities[entityId].id == entityId, "Entity not found");
        require(entities[entityId].status == EntityStatus.Active, "Not active");
        entities[entityId].status = EntityStatus.Dissolved;
        emit EntityDissolved(entityId);
    }

    /**
     * @notice Get all entities founded by an address
     */
    function getFounderEntities(address founder) external view returns (uint256[] memory) {
        return founderEntities[founder];
    }

    /**
     * @notice Check if an entity exists and is active
     */
    function isActive(uint256 entityId) external view returns (bool) {
        return entities[entityId].status == EntityStatus.Active;
    }
}
