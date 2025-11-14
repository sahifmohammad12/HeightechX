import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useIPFS } from '../contexts/IPFSContext'
import { Settings as SettingsIcon, Wallet, Fingerprint, Database, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { account, disconnectWallet } = useWallet()
  const { did, didDocument } = useDID()
  const { initializeIPFS, ipfs, isInitializing } = useIPFS()
  const [isInitializingIPFS, setIsInitializingIPFS] = useState(false)

  useEffect(() => {
    const autoInitIPFS = async () => {
      if (!ipfs && !isInitializing) {
        setIsInitializingIPFS(true)
        try {
          await initializeIPFS()
          toast.success('IPFS auto-initialized')
        } catch (error) {
          console.error('Error auto-initializing IPFS:', error)
        } finally {
          setIsInitializingIPFS(false)
        }
      }
    }
    autoInitIPFS()
  }, [])

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
        <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(0, 255, 200, 0.8)' }}>Settings</h1>
        <p className="text-blue-200 text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Wallet Settings */}
      <div className="card" style={{ background: 'rgba(0, 0, 0, 0.9)', boxShadow: '0 0 40px rgba(0, 255, 200, 0.2), inset 0 0 15px rgba(0, 255, 200, 0.05)', border: '2px solid var(--primary)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.5)' }}>
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>Wallet Connection</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>
              Connected Address
            </label>
            {account ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-black/50 rounded-xl border border-primary-500" style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.1)' }}>
                <div>
                  <p className="text-xs font-semibold text-primary-300 uppercase tracking-wide mb-1">Status</p>
                  <span className="inline-flex items-center gap-2 text-primary-300 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                </div>
                <p className="font-mono text-sm text-white break-all">{account}</p>
              </div>
            ) : (
              <p className="text-blue-200 text-lg italic">No wallet connected</p>
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
      <div className="card" style={{ background: 'rgba(0, 0, 0, 0.9)', boxShadow: '0 0 40px rgba(0, 255, 200, 0.2), inset 0 0 15px rgba(0, 255, 200, 0.05)', border: '2px solid var(--primary)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.5)' }}>
            <Fingerprint className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>Decentralized Identifier</h2>
        </div>
        <div className="space-y-4">
          {did ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>
                  Your DID
                </label>
                <div className="p-4 bg-black/50 rounded-xl border border-primary-500" style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.1)' }}>
                  <p className="font-mono text-sm text-white break-all">{did}</p>
                </div>
              </div>
              {didDocument && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>
                    DID Document Status
                  </label>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500 text-white font-semibold text-sm shadow-lg">
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
      <div className="card" style={{ background: 'rgba(0, 0, 0, 0.9)', boxShadow: '0 0 40px rgba(0, 255, 200, 0.2), inset 0 0 15px rgba(0, 255, 200, 0.05)', border: '2px solid var(--primary)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.5)' }}>
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>IPFS Configuration</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>
              IPFS Status
            </label>
            {ipfs ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500 text-white font-semibold text-sm shadow-lg">
                <CheckCircle className="w-4 h-4" />
                Active & Connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500 text-white font-semibold text-sm shadow-lg">
                <AlertCircle className="w-4 h-4" />
                {isInitializingIPFS ? 'Initializing...' : 'Initializing'}
              </div>
            )}
          </div>
          {!ipfs && !isInitializingIPFS && (
            <button
              onClick={handleInitializeIPFS}
              disabled={isInitializingIPFS}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 w-full"
            >
              {isInitializingIPFS ? 'Initializing...' : 'Initialize IPFS'}
            </button>
          )}
          <div className="p-4 rounded-xl border border-primary-500" style={{ background: 'rgba(0, 255, 200, 0.05)' }}>
            <p className="text-sm text-white">
              IPFS is used for decentralized file storage. Your files are stored on the InterPlanetary File System for secure, distributed access.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="rounded-xl border-2 border-accent-500 p-6 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 106, 0.06), inset 0 0 12px rgba(0, 255, 106, 0.03)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Data Management</h2>
        </div>
        <div className="space-y-4">
          <p className="text-blue-100">
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
      <div className="rounded-xl border-2 border-primary-500 p-6 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">About HeightechX</h2>
        </div>
        <div className="space-y-4 text-blue-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--primary)' }}>Version</p>
            <p className="text-lg font-semibold text-white">1.0.0</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--primary)' }}>Description</p>
            <p className="text-lg text-blue-100">Decentralized Digital Identity & Credential Vault</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--primary)' }}>Features</p>
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
