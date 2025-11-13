import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useIPFS } from '../contexts/IPFSContext'
import { Settings as SettingsIcon, Wallet, Fingerprint, Database, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { account, disconnectWallet } = useWallet()
  const { did, didDocument } = useDID()
  const { initializeIPFS, ipfs } = useIPFS()
  const [isInitializingIPFS, setIsInitializingIPFS] = useState(false)

  const handleInitializeIPFS = async () => {
    setIsInitializingIPFS(true)
    try {
      await initializeIPFS()
    } finally {
      setIsInitializingIPFS(false)
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear()
      toast.success('Local data cleared')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Wallet Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Wallet className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Wallet Connection</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connected Address
            </label>
            {account ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-sm text-gray-900">{account}</span>
                <button onClick={disconnectWallet} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No wallet connected</p>
            )}
          </div>
        </div>
      </div>

      {/* DID Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Fingerprint className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Decentralized Identifier</h2>
        </div>
        <div className="space-y-4">
          {did ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your DID
                </label>
                <p className="font-mono text-sm text-gray-900 break-all p-3 bg-gray-50 rounded-lg">
                  {did}
                </p>
              </div>
              {didDocument && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DID Document Status
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No DID generated yet</p>
          )}
        </div>
      </div>

      {/* IPFS Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">IPFS Configuration</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IPFS Status
            </label>
            {ipfs ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Not Initialized
              </span>
            )}
          </div>
          {!ipfs && (
            <button
              onClick={handleInitializeIPFS}
              disabled={isInitializingIPFS}
              className="btn-primary disabled:opacity-50"
            >
              {isInitializingIPFS ? 'Initializing...' : 'Initialize IPFS'}
            </button>
          )}
          <p className="text-sm text-gray-500">
            IPFS is used for decentralized file storage. Configure your IPFS node in the environment variables.
          </p>
        </div>
      </div>

      {/* Data Management */}
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Clear all locally stored data including credentials, DID information, and settings.
            This action cannot be undone.
          </p>
          <button
            onClick={handleClearData}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Clear All Local Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card bg-gray-50">
        <div className="flex items-center space-x-3 mb-4">
          <SettingsIcon className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">About</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Description:</strong> Decentralized Digital Identity & Credential Vault
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Decentralized Identifiers (DIDs)</li>
            <li>Verifiable Credentials (VCs)</li>
            <li>IPFS File Storage</li>
            <li>Selective Disclosure</li>
            <li>Cryptographic Verification</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Settings

