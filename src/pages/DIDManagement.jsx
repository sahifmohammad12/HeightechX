import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { Fingerprint, Copy, Check, AlertCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const DIDManagement = () => {
  const { account, connectWallet } = useWallet()
  const { did, didDocument, isLoading, generateDID } = useDID()
  const [copied, setCopied] = useState(false)

  const handleGenerateDID = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      await connectWallet()
      return
    }
    await generateDID()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">DID Management</h1>
        <p className="mt-2 text-gray-600">
          Create and manage your Decentralized Identifier (DID) for self-sovereign identity
        </p>
      </div>

      {/* Main Card */}
      <div className="card">
        {!account ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your wallet to generate a Decentralized Identifier
            </p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : !did ? (
          <div className="text-center py-12">
            <Fingerprint className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generate Your DID
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              A Decentralized Identifier (DID) is a unique identifier that you own and control.
              It's anchored on the blockchain and enables you to manage your digital identity.
            </p>
            <button
              onClick={handleGenerateDID}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate DID'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* DID Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Decentralized Identifier
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm break-all">
                  {did}
                </div>
                <button
                  onClick={() => copyToClipboard(did)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy DID"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* DID Document */}
            {didDocument && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    DID Document
                  </label>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(didDocument, null, 2))}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy JSON</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(didDocument, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* DID Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">DID Method</p>
                <p className="text-sm text-gray-600">ethr (Ethereum)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Verification Method</p>
                <p className="text-sm text-gray-600">EcdsaSecp256k1RecoveryMethod2020</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Controller</p>
                <p className="text-sm text-gray-600 font-mono break-all">{account}</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    About Decentralized Identifiers
                  </h4>
                  <p className="text-sm text-blue-800">
                    Your DID is unique, portable, and cryptographically verifiable. It enables you to:
                  </p>
                  <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                    <li>Own and control your digital identity</li>
                    <li>Issue and manage verifiable credentials</li>
                    <li>Prove your identity without revealing unnecessary information</li>
                    <li>Interact with any system that supports DIDs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Resources */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learn More</h3>
        <div className="space-y-2">
          <a
            href="https://www.w3.org/TR/did-core/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <span>W3C DID Specification</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://www.w3.org/TR/vc-data-model/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Verifiable Credentials Data Model</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default DIDManagement

