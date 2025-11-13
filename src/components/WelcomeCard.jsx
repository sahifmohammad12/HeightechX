import { useState } from 'react'
import { User, Wallet, Fingerprint, Copy, CheckCircle } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'

const WelcomeCard = () => {
  const { account } = useWallet()
  const { did } = useDID()
  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const userName = "User"

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-8 text-white shadow-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Welcome, {userName}! 👋</h2>
            <p className="text-primary-100">Your decentralized identity vault</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wallet Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-100 text-sm font-medium">Wallet</span>
              {account && <CheckCircle className="w-4 h-4 text-green-300" />}
            </div>
            {account ? (
              <div>
                <p className="font-mono text-sm mb-2">{account.slice(0, 6)}...{account.slice(-4)}</p>
                <button
                  onClick={() => copyToClipboard(account, 'wallet')}
                  className="text-xs text-primary-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copied === 'wallet' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-primary-200">Not connected</p>
            )}
          </div>

          {/* DID Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-100 text-sm font-medium">DID</span>
              {did && <CheckCircle className="w-4 h-4 text-green-300" />}
            </div>
            {did ? (
              <div>
                <p className="font-mono text-xs mb-2 break-all">{did.slice(0, 20)}...</p>
                <button
                  onClick={() => copyToClipboard(did, 'did')}
                  className="text-xs text-primary-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copied === 'did' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-primary-200">Not generated</p>
            )}
          </div>

          {/* Overall Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-100 text-sm font-medium">Status</span>
              <div className={`w-2 h-2 rounded-full ${account && did ? 'bg-green-300' : 'bg-yellow-300'}`}></div>
            </div>
            <p className="text-sm font-medium">
              {account && did ? 'Ready to Go' : account ? 'Generate DID' : 'Connect Wallet'}
            </p>
            <p className="text-xs text-primary-200 mt-1">
              {account && did ? 'All setup complete!' : 'Complete the setup'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeCard
