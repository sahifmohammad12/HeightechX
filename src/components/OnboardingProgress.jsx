import { useWallet } from '../contexts/WalletContext'
import { useDID } from '../contexts/DIDContext'
import { useCredential } from '../contexts/CredentialContext'
import { CheckCircle, Circle, Lock } from 'lucide-react'

const OnboardingProgress = () => {
  const { account, connectWallet } = useWallet()
  const { did, generateDID } = useDID()
  const { credentials } = useCredential()

  const steps = [
    {
      id: 1,
      title: 'Connect Wallet',
      description: 'Link your Web3 wallet to get started',
      completed: !!account,
      action: connectWallet,
      actionLabel: 'Connect',
    },
    {
      id: 2,
      title: 'Generate DID',
      description: 'Create your Decentralized Identifier',
      completed: !!did,
      disabled: !account,
      action: generateDID,
      actionLabel: 'Generate',
    },
    {
      id: 3,
      title: 'Upload Credential',
      description: 'Add your first verifiable credential',
      completed: credentials.length > 0,
      disabled: !did,
      actionLabel: 'Upload',
      href: '/credentials/upload',
    },
    {
      id: 4,
      title: 'Verify & Share',
      description: 'Share your credentials securely',
      completed: false,
      disabled: credentials.length === 0,
      actionLabel: 'Verify',
      href: '/verification',
    },
  ]

  const completedSteps = steps.filter(s => s.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="rounded-2xl border-2 border-primary-500 p-8 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Your Setup Journey</h3>
        <p className="text-blue-200">Complete these steps to unlock your decentralized identity</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{completedSteps}/{steps.length}</span>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(0, 255, 200, 0.1)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              step.completed
                ? 'bg-accent-50 border-accent-200'
                : step.disabled
                ? 'bg-gray-50 border-secondary-200 opacity-60'
                : 'bg-primary-50 border-primary-200 hover:border-primary-300'
            }`}
          >
            {/* Step Number */}
            <div className="flex-shrink-0">
              {step.completed ? (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-500 text-white animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                    step.disabled
                      ? 'bg-secondary-300 text-secondary-600'
                      : 'bg-primary-500 text-white'
                  }`}
                >
                  {step.id}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-dark-900">{step.title}</h4>
                {step.completed && (
                  <span className="inline-block px-2 py-0.5 bg-accent-200 text-accent-800 text-xs font-bold rounded-full">
                    Done
                  </span>
                )}
                {step.disabled && (
                  <span className="inline-block px-2 py-0.5 bg-secondary-200 text-secondary-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
              <p className="text-sm text-secondary-600">{step.description}</p>
            </div>

            {/* Action Button */}
            {!step.completed && (
              <div className="flex-shrink-0">
                {step.action ? (
                  <button
                    onClick={step.action}
                    disabled={step.disabled}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      step.disabled
                        ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                    }`}
                  >
                    {step.actionLabel}
                  </button>
                ) : step.href ? (
                  <a
                    href={step.href}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all inline-block ${
                      step.disabled
                        ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                    }`}
                  >
                    {step.actionLabel}
                  </a>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <div className="mt-8 p-6 bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-200 rounded-xl text-center">
          <CheckCircle className="w-12 h-12 text-accent-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-dark-900 mb-1">Setup Complete! 🎉</h4>
          <p className="text-secondary-600">Your decentralized identity is ready. Start managing your credentials securely.</p>
        </div>
      )}
    </div>
  )
}

export default OnboardingProgress
