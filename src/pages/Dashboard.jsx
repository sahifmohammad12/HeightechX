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
    <div className="space-y-8 pb-8 p-6 rounded-2xl" style={{background: 'linear-gradient(180deg, rgba(0,4,10,0.55), rgba(4,16,23,0.55))', border: '1px solid rgba(0,255,160,0.06)'}}>
      {/* Welcome Card */}
      <WelcomeCard />

      {/* Onboarding Progress */}
      <OnboardingProgress />

      {/* Stats Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{color: 'var(--text)', borderLeft: '4px solid rgba(0,255,160,0.08)', paddingLeft: '10px'}}>Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: 'rgba(191,252,240,0.75)'}}>{stat.name}</p>
                    <p className="mt-3 text-3xl font-bold" style={{color: 'var(--text)'}}>{stat.value}</p>
                  </div>
                  <div style={{background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '14px', borderRadius: 12, color: '#001014', boxShadow: '0 6px 20px rgba(0,255,160,0.08)'}}>
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
        <h3 className="text-xl font-bold mb-4" style={{color: 'var(--text)', borderLeft: '4px solid rgba(0,255,160,0.08)', paddingLeft: '10px'}}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            const actionStyle = action.disabled
              ? { background: 'rgba(255,255,255,0.02)', color: 'rgba(191,252,240,0.6)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.02)' }
              : { background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#001014' }

            return (
              <a
                key={action.title}
                href={action.disabled ? '#' : action.href}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300`}
                style={actionStyle}
              >
                {!action.disabled && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'radial-gradient(circle at 10% 10%, rgba(0,255,160,0.06), transparent 20%)'}} />
                )}

                <div className="relative z-10">
                  <Icon className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold text-sm mb-1" style={{color: action.disabled ? 'rgba(191,252,240,0.85)' : '#001014'}}>{action.title}</h4>
                  <p className="text-xs" style={{color: action.disabled ? 'rgba(191,252,240,0.6)' : 'rgba(0,0,0,0.7)'}}>
                    {action.description}
                  </p>

                  {action.disabled && (
                    <div className="mt-3 flex items-center gap-1 text-xs" style={{color: 'rgba(191,252,240,0.6)'}}>
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}

                  {!action.disabled && (
                    <div className="mt-3 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{color: '#001014'}}>
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
          <h3 className="text-xl font-bold" style={{color: 'var(--text)', borderLeft: '4px solid rgba(0,255,160,0.08)', paddingLeft: '10px'}}>Recent Credentials</h3>
          {credentials.length > 0 && (
            <a href="/credentials" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {credentials.length === 0 ? (
          <div className="card text-center py-16" style={{borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)'}}>
            <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(255,255,255,0.02)'}}>
              <FileText className="w-8 h-8" style={{color: 'var(--text)'}} />
            </div>
            <h4 className="text-lg font-semibold mb-2" style={{color: 'var(--text)'}}>No Credentials Yet</h4>
            <p style={{color: 'rgba(191,252,240,0.7)'}} className="mb-6">Upload your first credential to begin your decentralized identity journey!</p>
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
              <h4 className="font-semibold" style={{color: 'var(--text)'}}>Activity</h4>
              <BarChart3 className="w-5 h-5" style={{color: 'var(--primary)'}} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{color: 'rgba(191,252,240,0.75)'}}>Credentials Added</span>
                <span className="font-semibold" style={{color: 'var(--text)'}}>{credentials.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{color: 'rgba(191,252,240,0.75)'}}>Verified</span>
                <span className="font-semibold" style={{color: 'var(--accent)'}}>{credentials.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{color: 'rgba(191,252,240,0.75)'}}>Shared</span>
                <span className="font-semibold" style={{color: 'var(--text)'}}>0</span>
              </div>
            </div>
          </div>

          <div className="card" style={{background: 'linear-gradient(135deg, rgba(0,255,209,0.03), rgba(0,255,106,0.03))', border: '1px solid rgba(0,255,160,0.06)'}}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold" style={{color: 'var(--text)'}}>Tips</h4>
              <Zap className="w-5 h-5" style={{color: 'var(--primary)'}} />
            </div>
            <ul className="space-y-2 text-sm" style={{color: 'rgba(191,252,240,0.75)'}}>
              <li className="flex gap-2">
                <span style={{color: 'var(--primary)', fontWeight: 700}}>•</span>
                Keep your DID secure and backed up
              </li>
              <li className="flex gap-2">
                <span style={{color: 'var(--primary)', fontWeight: 700}}>•</span>
                Share credentials selectively
              </li>
              <li className="flex gap-2">
                <span style={{color: 'var(--primary)', fontWeight: 700}}>•</span>
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

