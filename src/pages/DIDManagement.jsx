import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { Fingerprint, Copy, Check, AlertCircle, ExternalLink, Shield, Lock, Zap, ArrowRight } from 'lucide-react'
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

  const features = [
    {
      icon: Lock,
      title: 'Own & Control',
      description: 'Your identity belongs to you, not a corporation'
    },
    {
      icon: Shield,
      title: 'Cryptographically Secure',
      description: 'Verifiable and tamper-proof on blockchain'
    },
    {
      icon: Zap,
      title: 'Portable & Interoperable',
      description: 'Works across any system that supports DIDs'
    },
  ]

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-900 mb-2">DID Management</h1>
        <p className="text-secondary-600 text-lg">
          Create and manage your Decentralized Identifier (DID) for self-sovereign identity
        </p>
      </div>

      {/* Main Content */}
      {!account ? (
        <div className="rounded-xl border-2 border-primary-500 p-6 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h3>
            <p className="text-blue-200 mb-8 max-w-md mx-auto text-lg">
              Connect your wallet to generate a Decentralized Identifier
            </p>
            <button onClick={connectWallet} className="btn-primary inline-flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Connect Wallet
            </button>
          </div>
        </div>
      ) : !did ? (
        <>
          {/* Generate DID Card */}
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0 shadow-xl">
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                <Fingerprint className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-3">Generate Your DID</h3>
              <p className="text-primary-100 mb-8 max-w-md mx-auto text-lg">
                A Decentralized Identifier is your unique, portable, and cryptographically verifiable identity on the blockchain.
              </p>
              <button
                onClick={handleGenerateDID}
                disabled={isLoading}
                className="btn-primary inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Fingerprint className="w-5 h-5" />
                {isLoading ? 'Generating...' : 'Generate DID Now'}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="card hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-dark-900 mb-2">{feature.title}</h4>
                  <p className="text-secondary-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* DID Display Card */}
          <div className="card border-accent-200 bg-gradient-to-br from-accent-50 to-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-dark-900 mb-1">Your DID</h3>
                <p className="text-secondary-600">Active and verified on blockchain</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-semibold text-sm">
                <Check className="w-4 h-4" />
                Active
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 p-4 bg-dark-50 rounded-xl border border-secondary-200 font-mono text-sm break-all">
                {did}
              </div>
              <button
                onClick={() => copyToClipboard(did)}
                className="p-3 hover:bg-primary-100 rounded-lg transition-all duration-200 text-primary-600 flex-shrink-0"
                title="Copy DID"
              >
                {copied ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* DID Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-secondary-200">
              <div>
                <p className="text-sm font-semibold text-secondary-600 mb-2 uppercase tracking-wide">DID Method</p>
                <p className="text-lg font-bold text-dark-900">ethr (Ethereum)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-600 mb-2 uppercase tracking-wide">Verification Method</p>
                <p className="text-sm text-dark-900 font-mono">EcdsaSecp256k1RecoveryMethod2020</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-secondary-600 mb-2 uppercase tracking-wide">Controller Address</p>
                <p className="text-sm text-dark-900 font-mono break-all">{account}</p>
              </div>
            </div>
          </div>

          {/* DID Document */}
          {didDocument && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-dark-900">DID Document</h4>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(didDocument, null, 2))}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy JSON
                </button>
              </div>
              <div className="p-4 bg-dark-50 rounded-xl border border-secondary-200 overflow-x-auto">
                <pre className="text-xs text-dark-900 font-mono">
                  {JSON.stringify(didDocument, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="card hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-dark-900 mb-2">{feature.title}</h4>
                  <p className="text-secondary-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Info Box */}
          <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-dark-900 mb-2">What You Can Do With Your DID</h4>
                <ul className="space-y-2 text-sm text-secondary-700">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-600" />
                    Issue and manage verifiable credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-600" />
                    Prove your identity without revealing unnecessary data
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-600" />
                    Interact with systems that support DIDs
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-600" />
                    Control your digital presence independently
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Resources */}
      <div className="card">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Learn More</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://www.w3.org/TR/did-core/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-all duration-200 group"
          >
            <span className="text-sm font-semibold text-primary-700">W3C DID Specification</span>
            <ExternalLink className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://www.w3.org/TR/vc-data-model/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg bg-accent-50 hover:bg-accent-100 border border-accent-200 transition-all duration-200 group"
          >
            <span className="text-sm font-semibold text-accent-700">VC Data Model</span>
            <ExternalLink className="w-4 h-4 text-accent-600 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default DIDManagement

