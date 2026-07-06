// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EntityForge Vault
 * @notice Treasury and revenue distribution for Autonomous Economic Entities.
 *         Deposits flow in from customer payments and contract settlements.
 *         Distribution follows member ownership shares set at entity formation.
 */
contract EntityForgeVault {
    struct VaultState {
        uint256 entityId;
        uint256 totalDeposits;
        uint256 totalDistributed;
        address[] members;
        mapping(address => uint256) shares; // basis points (0-10000)
        bool initialized;
    }

    mapping(uint256 => VaultState) public vaults;

    event Deposited(uint256 indexed entityId, address from, uint256 amount);
    event Distributed(uint256 indexed entityId, address member, uint256 amount);
    event VaultInitialized(uint256 indexed entityId, address vault);

    /**
     * @notice Initialize vault for an entity with member shares
     * @param entityId Entity to create vault for
     * @param members Array of member addresses
     * @param sharesBps Array of ownership shares in basis points (must sum to 10000)
     */
    function initVault(
        uint256 entityId,
        address[] calldata members,
        uint256[] calldata sharesBps
    ) external {
        require(!vaults[entityId].initialized, "Already initialized");
        require(members.length == sharesBps.length, "Length mismatch");
        require(members.length > 0, "Need at least 1 member");

        VaultState storage vault = vaults[entityId];
        vault.entityId = entityId;
        vault.initialized = true;

        uint256 totalShares;
        for (uint256 i = 0; i < members.length; i++) {
            require(members[i] != address(0), "Invalid member");
            require(sharesBps[i] > 0, "Share must be > 0");
            vault.members.push(members[i]);
            vault.shares[members[i]] = sharesBps[i];
            totalShares += sharesBps[i];
        }
        require(totalShares == 10000, "Shares must sum to 10000 (100%)");

        emit VaultInitialized(entityId, address(this));
    }

    /**
     * @notice Deposit funds into the entity vault
     */
    function deposit(uint256 entityId) external payable {
        require(vaults[entityId].initialized, "Vault not initialized");
        vaults[entityId].totalDeposits += msg.value;
        emit Deposited(entityId, msg.sender, msg.value);
    }

    /**
     * @notice Distribute vault balance to members according to shares
     */
    function distribute(uint256 entityId) external {
        VaultState storage vault = vaults[entityId];
        require(vault.initialized, "Vault not initialized");

        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to distribute");

        for (uint256 i = 0; i < vault.members.length; i++) {
            address member = vault.members[i];
            uint256 share = vault.shares[member];
            uint256 amount = (balance * share) / 10000;
            if (amount > 0) {
                vault.totalDistributed += amount;
                (bool sent, ) = payable(member).call{value: amount}("");
                require(sent, "Transfer failed");
                emit Distributed(entityId, member, amount);
            }
        }
    }

    /**
     * @notice Get vault balance
     */
    function getBalance(uint256 entityId) external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get member share
     */
    function getMemberShare(uint256 entityId, address member) external view returns (uint256) {
        return vaults[entityId].shares[member];
    }

    receive() external payable {}
}
