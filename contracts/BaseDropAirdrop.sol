// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin contracts for safe transfers
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BaseDropAirdrop {
    using SafeERC20 for IERC20;

    event ERC20Airdrop(
        address indexed sender,
        address indexed token,
        uint256 amountPerRecipient,
        uint256 totalRecipients,
        string messageURI
    );
    
    event ERC721Airdrop(
        address indexed sender,
        address indexed token,
        uint256 totalRecipients,
        string messageURI
    );

    /**
     * @notice Airdrop an ERC20 token to a list of recipients.
     * @param token The ERC20 token address.
     * @param recipients An array of recipient addresses.
     * @param amount The amount of tokens to send to each recipient.
     * @param messageURI IPFS or on-chain URI containing a message for the airdrop.
     */
    function airdropERC20(
        IERC20 token,
        address[] calldata recipients,
        uint256 amount,
        string calldata messageURI
    ) external {
        require(recipients.length > 0, "No recipients provided");
        // Loop through each recipient and transfer tokens
        for (uint256 i = 0; i < recipients.length; i++) {
            token.safeTransferFrom(msg.sender, recipients[i], amount);
        }
        emit ERC20Airdrop(msg.sender, address(token), amount, recipients.length, messageURI);
    }

    /**
     * @notice Airdrop ERC721 NFTs to a list of recipients.
     * @param token The ERC721 token address.
     * @param recipients An array of recipient addresses.
     * @param tokenIds An array of token IDs corresponding to each recipient.
     * @param messageURI IPFS or on-chain URI containing a message for the airdrop.
     */
    function airdropERC721(
        IERC721 token,
        address[] calldata recipients,
        uint256[] calldata tokenIds,
        string calldata messageURI
    ) external {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == tokenIds.length, "Recipients and tokenIds count mismatch");
        // Loop through each recipient and transfer the corresponding NFT
        for (uint256 i = 0; i < recipients.length; i++) {
            token.safeTransferFrom(msg.sender, recipients[i], tokenIds[i]);
        }
        emit ERC721Airdrop(msg.sender, address(token), recipients.length, messageURI);
    }

    /**
     * @notice Batch airdrop ERC20 tokens with different amounts per recipient.
     * @param token The ERC20 token address.
     * @param recipients An array of recipient addresses.
     * @param amounts An array of token amounts corresponding to each recipient.
     * @param messageURI IPFS or on-chain URI containing a message for the airdrop.
     */
    function batchAirdropERC20(
        IERC20 token,
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata messageURI
    ) external {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == amounts.length, "Recipients and amounts count mismatch");
        
        uint256 totalAmount = 0;
        
        // Calculate total amount for all recipients
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        // Loop through each recipient and transfer tokens
        for (uint256 i = 0; i < recipients.length; i++) {
            token.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
        }
        
        emit ERC20Airdrop(msg.sender, address(token), 0, recipients.length, messageURI);
    }
} 