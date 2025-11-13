# Decentralized Digital Identity & Credential Vault

A blockchain-based Decentralized Identity and Credential Vault using Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs). This solution ensures that individuals securely own, manage, and share their identity documents without relying on any central authority.

## Features

- **Decentralized Identifiers (DIDs)**: Create and manage unique, blockchain-anchored digital identities
- **Verifiable Credentials (VCs)**: Issue and manage verifiable credentials for documents like Aadhaar, PAN, academic certificates
- **IPFS Integration**: Decentralized and immutable file storage using InterPlanetary File System
- **Selective Disclosure**: Share only required data instead of full documents
- **Cryptographic Verification**: Verify credentials without a central validation body
- **Self-Sovereign Identity**: Full ownership and control of digital identities

## Tech Stack

- **Frontend**: React.js 18 with Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (via ethers.js)
- **Storage**: IPFS (InterPlanetary File System)
- **Identity**: DID (Decentralized Identifiers) & VC (Verifiable Credentials)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or another Web3 wallet
- (Optional) IPFS node or Infura IPFS credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HeightechX
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_INFURA_PROJECT_SECRET=your_infura_project_secret
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/          # Layout components (sidebar, header)
├── contexts/            # React Context providers
│   ├── WalletContext.jsx    # Wallet connection management
│   ├── DIDContext.jsx       # DID generation and management
│   ├── CredentialContext.jsx # Credential CRUD operations
│   └── IPFSContext.jsx      # IPFS integration
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── DIDManagement.jsx
│   ├── CredentialManagement.jsx
│   ├── CredentialUpload.jsx
│   ├── SelectiveDisclosure.jsx
│   ├── Verification.jsx
│   └── Settings.jsx
├── App.jsx              # Main app component with routing
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" in the sidebar
- Approve the connection in MetaMask

### 2. Generate DID
- Navigate to "DID Management"
- Click "Generate DID" to create your decentralized identifier

### 3. Upload Credentials
- Go to "Upload Credential"
- Fill in credential information
- Upload document file (stored on IPFS)
- Create verifiable credential

### 4. Manage Credentials
- View all credentials in "Credentials" page
- Search and filter credentials
- Download or delete credentials

### 5. Selective Disclosure
- Select a credential
- Choose specific fields to disclose
- Generate a disclosure proof

### 6. Verify Credentials
- Upload a credential JSON file
- Verify authenticity and structure
- View verification results

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Environment Variables

- `VITE_INFURA_PROJECT_ID`: Infura project ID for IPFS (optional)
- `VITE_INFURA_PROJECT_SECRET`: Infura project secret for IPFS (optional)

If not provided, the app will use a mock IPFS implementation for development.

## Security Considerations

⚠️ **Important**: This is a development version. For production use:

1. Implement proper cryptographic signatures for credentials
2. Use a production IPFS node or pinning service
3. Implement proper DID resolution
4. Add blockchain anchoring for DIDs
5. Implement proper key management
6. Add encryption for sensitive data
7. Implement proper access controls

## Future Enhancements

- [ ] Full blockchain anchoring for DIDs
- [ ] Real cryptographic signature generation and verification
- [ ] DID resolution from blockchain
- [ ] Support for multiple DID methods
- [ ] Credential revocation
- [ ] Multi-signature support
- [ ] Mobile app support
- [ ] Offline mode support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## References

- [W3C DID Specification](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)

