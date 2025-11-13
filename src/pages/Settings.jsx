import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useIPFS } from '../contexts/IPFSContext'
import { Settings as SettingsIcon, Wallet, Fingerprint, Database, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react'
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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-900 mb-2">Settings</h1>
        <p className="text-secondary-600 text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Wallet Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900">Wallet Connection</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-3 uppercase tracking-wide">
              Connected Address
            </label>
            {account ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
                <div>
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Status</p>
                  <span className="inline-flex items-center gap-2 text-primary-700 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                </div>
                <p className="font-mono text-sm text-dark-900 break-all">{account}</p>
              </div>
            ) : (
              <p className="text-secondary-600 text-lg italic">No wallet connected</p>
            )}
          </div>
          {account && (
            <button onClick={disconnectWallet} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>

      {/* DID Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900">Decentralized Identifier</h2>
        </div>
        <div className="space-y-4">
          {did ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-3 uppercase tracking-wide">
                  Your DID
                </label>
                <div className="p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border border-accent-200">
                  <p className="font-mono text-sm text-dark-900 break-all">{did}</p>
                </div>
              </div>
              {didDocument && (
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-3 uppercase tracking-wide">
                    DID Document Status
                  </label>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Active & Verified
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800">No DID generated yet. Visit the DID Management page to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* IPFS Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900">IPFS Configuration</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-3 uppercase tracking-wide">
              IPFS Status
            </label>
            {ipfs ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" />
                Not Initialized
              </div>
            )}
          </div>
          {!ipfs && (
            <button
              onClick={handleInitializeIPFS}
              disabled={isInitializingIPFS}
              className="btn-primary disabled:opacity-50 font-semibold w-full"
            >
              {isInitializingIPFS ? 'Initializing...' : 'Initialize IPFS'}
            </button>
          )}
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
            <p className="text-sm text-primary-800">
              IPFS is used for decentralized file storage. Your files are stored on the InterPlanetary File System for secure, distributed access.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900">Data Management</h2>
        </div>
        <div className="space-y-4">
          <p className="text-dark-900">
            Clear all locally stored data including credentials, DID information, and settings.
            <span className="block text-red-600 font-semibold mt-2">⚠️ This action cannot be undone.</span>
          </p>
          <button
            onClick={handleClearData}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors w-full"
          >
            Clear All Local Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card bg-gradient-to-br from-secondary-50 to-primary-50 border-secondary-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900">About HeightechX</h2>
        </div>
        <div className="space-y-4 text-dark-900">
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Version</p>
            <p className="text-lg font-semibold">1.0.0</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Description</p>
            <p className="text-lg">Decentralized Digital Identity & Credential Vault</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-3">Features</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-600" />
                <span>Decentralized Identifiers (DIDs)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-600" />
                <span>Verifiable Credentials (VCs)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-600" />
                <span>IPFS File Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-600" />
                <span>Selective Disclosure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-600" />
                <span>Cryptographic Verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
