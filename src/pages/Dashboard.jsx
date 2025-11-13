import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useCredential } from '../contexts/CredentialContext'
import { Shield, Fingerprint, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { account } = useWallet()
  const { did } = useDID()
  const { credentials } = useCredential()

  const stats = [
    {
      name: 'Total Credentials',
      value: credentials.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'DID Status',
      value: did ? 'Active' : 'Not Generated',
      icon: Fingerprint,
      color: did ? 'text-green-600' : 'text-gray-600',
      bgColor: did ? 'bg-green-100' : 'bg-gray-100',
    },
    {
      name: 'Wallet Connected',
      value: account ? 'Yes' : 'No',
      icon: Shield,
      color: account ? 'text-green-600' : 'text-red-600',
      bgColor: account ? 'bg-green-100' : 'bg-red-100',
    },
  ]

  const recentCredentials = credentials.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your decentralized identity and verifiable credentials
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status Alerts */}
      {(!account || !did) && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Setup Required</h3>
              <p className="mt-1 text-sm text-yellow-700">
                {!account && 'Please connect your wallet to get started. '}
                {account && !did && 'Please generate your Decentralized Identifier (DID) to manage credentials.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Credentials */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Credentials</h2>
          {credentials.length > 0 && (
            <a href="/credentials" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </a>
          )}
        </div>

        {credentials.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No credentials yet</p>
            <a
              href="/credentials/upload"
              className="mt-4 inline-block btn-primary"
            >
              Upload Your First Credential
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCredentials.map((credential) => (
              <div
                key={credential.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {credential.type[1] || 'Credential'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issued {new Date(credential.issuanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create your decentralized identity and start managing your credentials securely.
          </p>
          <div className="flex space-x-3">
            {!account && (
              <a href="/" className="btn-primary text-sm">
                Connect Wallet
              </a>
            )}
            {account && !did && (
              <a href="/did" className="btn-primary text-sm">
                Generate DID
              </a>
            )}
            {did && (
              <a href="/credentials/upload" className="btn-primary text-sm">
                Upload Credential
              </a>
            )}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn More</h3>
          <p className="text-sm text-gray-600 mb-4">
            Understand how decentralized identity and verifiable credentials work.
          </p>
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <TrendingUp className="w-4 h-4" />
            <span>Self-sovereign identity powered by blockchain</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

