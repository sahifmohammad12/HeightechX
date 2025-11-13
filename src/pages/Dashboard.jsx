import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useCredential } from '../contexts/CredentialContext'
import { Shield, Fingerprint, FileText, CheckCircle, AlertCircle, TrendingUp, ArrowRight, Lock, Zap, Award, BarChart3, Eye } from 'lucide-react'
import WelcomeCard from '../components/WelcomeCard'
import OnboardingProgress from '../components/OnboardingProgress'

const Dashboard = () => {
  const { account, connectWallet } = useWallet()
  const { did } = useDID()
  const { credentials } = useCredential()

  const stats = [
    {
      name: 'Total Credentials',
      value: credentials.length,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      name: 'DID Status',
      value: did ? 'Active' : 'Inactive',
      icon: Fingerprint,
      color: did ? 'text-accent-600' : 'text-secondary-600',
      bgColor: did ? 'bg-accent-100' : 'bg-secondary-100',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      name: 'Wallet',
      value: account ? 'Connected' : 'Pending',
      icon: Shield,
      color: account ? 'text-accent-600' : 'text-secondary-600',
      bgColor: account ? 'bg-accent-100' : 'bg-secondary-100',
      gradient: 'from-accent-500 to-accent-600'
    },
  ]

  const quickActions = [
    {
      title: 'Generate DID',
      description: 'Create your decentralized identifier',
      icon: Fingerprint,
      href: '/did',
      disabled: !account,
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Upload Credential',
      description: 'Add your first verifiable credential',
      icon: FileText,
      href: '/credentials/upload',
      disabled: !did,
      color: 'from-accent-500 to-accent-600'
    },
    {
      title: 'Share Credential',
      description: 'Share with selective disclosure',
      icon: Eye,
      href: '/disclosure',
      disabled: !did || credentials.length === 0,
      color: 'from-primary-500 to-accent-500'
    },
    {
      title: 'Verify',
      description: 'Verify your credentials',
      icon: CheckCircle,
      href: '/verification',
      disabled: !did,
      color: 'from-accent-500 to-primary-500'
    },
  ]

  const recentCredentials = credentials.slice(-5).reverse()

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Card */}
      <WelcomeCard />

      {/* Onboarding Progress */}
      <OnboardingProgress />

      {/* Stats Grid */}
      <div>
        <h3 className="text-xl font-bold text-dark-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                    <p className="mt-3 text-3xl font-bold text-dark-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div>
        <h3 className="text-xl font-bold text-dark-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <a
                key={action.title}
                href={action.disabled ? '#' : action.href}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  action.disabled
                    ? 'bg-secondary-100 cursor-not-allowed opacity-60'
                    : `bg-gradient-to-br ${action.color} text-white hover:shadow-xl hover:scale-105 active:scale-95`
                }`}
              >
                {/* Background glow */}
                {!action.disabled && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="relative z-10">
                  <Icon className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                  <p className={`text-xs ${action.disabled ? 'text-secondary-600' : 'text-white/80'}`}>
                    {action.description}
                  </p>

                  {action.disabled && (
                    <div className="mt-3 flex items-center gap-1 text-xs">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}

                  {!action.disabled && (
                    <div className="mt-3 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                      <span>Get Started</span>
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Recent Credentials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-dark-900">Recent Credentials</h3>
          {credentials.length > 0 && (
            <a href="/credentials" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {credentials.length === 0 ? (
          <div className="card text-center py-16 border-2 border-dashed border-secondary-300">
            <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-secondary-600" />
            </div>
            <h4 className="text-lg font-semibold text-dark-900 mb-2">No Credentials Yet</h4>
            <p className="text-secondary-600 mb-6">Upload your first credential to begin your decentralized identity journey!</p>
            <a
              href="/credentials/upload"
              className="inline-block btn-primary"
            >
              Upload First Credential
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCredentials.map((credential, idx) => (
              <div
                key={credential.id}
                className="card hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark-900 truncate">
                        {credential.type[1] || 'Credential'}
                      </p>
                      <p className="text-sm text-secondary-600">
                        Issued {new Date(credential.issuanceDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs font-bold rounded-full">
                      Verified
                    </span>
                    <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      {credentials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-dark-900">Activity</h4>
              <BarChart3 className="w-5 h-5 text-primary-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Credentials Added</span>
                <span className="font-semibold text-dark-900">{credentials.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Verified</span>
                <span className="font-semibold text-accent-600">{credentials.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Shared</span>
                <span className="font-semibold text-dark-900">0</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-dark-900">Tips</h4>
              <Zap className="w-5 h-5 text-primary-500" />
            </div>
            <ul className="space-y-2 text-sm text-secondary-700">
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Keep your DID secure and backed up
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Share credentials selectively
              </li>
              <li className="flex gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Verify credentials before trusting
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

