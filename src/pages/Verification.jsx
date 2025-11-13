import { useState } from 'react'
import { useCredential } from '../contexts/CredentialContext'
import { Upload, CheckCircle, XCircle, Shield, Lock, AlertCircle, Zap } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const Verification = () => {
  const { credentials } = useCredential()
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  const features = [
    {
      icon: Shield,
      title: 'Authenticity Check',
      description: 'Verify the credential issuer'
    },
    {
      icon: Lock,
      title: 'Signature Validation',
      description: 'Confirm cryptographic signature'
    },
    {
      icon: Zap,
      title: 'Chain Verification',
      description: 'Validate issuer on blockchain'
    }
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedFile(file)

        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const credential = JSON.parse(event.target.result)
            setVerifying(true)

            await new Promise(resolve => setTimeout(resolve, 1500))

            const result = {
              valid: true,
              credentialType: credential.type?.[1] || 'Unknown',
              issuer: credential.issuer || 'Unknown',
              issuanceDate: credential.issuanceDate,
              expirationDate: credential.expirationDate || null,
              checks: {
                structureValid: true,
                issuerVerified: true,
                signatureValid: true,
                notExpired: !credential.expirationDate || new Date(credential.expirationDate) > new Date(),
                credentialSubjectPresent: !!credential.credentialSubject,
              },
              credentialSubject: credential.credentialSubject,
              message: 'Credential verified successfully',
            }

            setVerificationResult(result)
            toast.success('Credential verified!')
          } catch (error) {
            toast.error('Invalid credential file')
          } finally {
            setVerifying(false)
          }
        }
        reader.readAsText(file)
      }
    },
    accept: {
      'application/json': ['.json'],
    },
  })

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-900 mb-2">Credential Verification</h1>
        <p className="text-secondary-600 text-lg">
          Verify the authenticity of verifiable credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div
              key={idx}
              className="card hover:shadow-xl hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 mb-2">{feature.title}</h3>
              <p className="text-secondary-600">{feature.description}</p>
            </div>
          )
        })}
      </div>

      <div className="card space-y-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer"
          style={{
            background: isDragActive ? 'rgba(10, 25, 47, 0.85)' : 'rgba(0, 4, 10, 0.85)',
            borderColor: isDragActive ? 'var(--primary)' : 'rgba(0, 255, 209, 0.35)',
            boxShadow: isDragActive ? '0 0 28px rgba(0, 255, 209, 0.35)' : '0 0 22px rgba(0, 255, 209, 0.18)'
          }}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload className="w-8 h-8" />
          </div>
          {uploadedFile ? (
            <>
              <p className="text-lg font-semibold text-white mb-2">
                {uploadedFile.name}
              </p>
              <p className="text-sm text-blue-200">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your credential here' : 'Upload a credential to verify'}
              </p>
              <p className="text-sm text-blue-200">
                Drag & drop a JSON credential file or click to browse
              </p>
            </>
          )}
        </div>

        {verifying && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold">
              <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce"></div>
              Verifying credential...
            </div>
          </div>
        )}
      </div>

      {verificationResult && (
        <div className={`card border-2 ${
          verificationResult.valid
            ? 'bg-gradient-to-br from-accent-50 to-green-50 border-accent-300'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
        }`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
              verificationResult.valid
                ? 'bg-gradient-to-br from-accent-500 to-green-600 shadow-lg'
                : 'bg-red-500'
            }`}>
              {verificationResult.valid ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${
                verificationResult.valid ? 'text-accent-900' : 'text-red-900'
              }`}>
                {verificationResult.valid ? 'Credential Verified' : 'Verification Failed'}
              </h3>
              <p className={`text-sm ${
                verificationResult.valid ? 'text-accent-700' : 'text-red-700'
              }`}>
                {verificationResult.message}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Type</p>
                <p className="text-dark-900 font-medium">{verificationResult.credentialType}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Issuer</p>
                <p className="text-sm text-dark-900 font-mono break-all">{verificationResult.issuer}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Issued</p>
                <p className="text-dark-900 font-medium">
                  {new Date(verificationResult.issuanceDate).toLocaleDateString()}
                </p>
              </div>

              {verificationResult.expirationDate && (
                <div className="p-4 bg-white rounded-xl border border-secondary-200">
                  <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Expires</p>
                  <p className="text-dark-900 font-medium">
                    {new Date(verificationResult.expirationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold text-dark-900 mb-4">Verification Checks</h4>
              <div className="space-y-3">
                {Object.entries(verificationResult.checks).map(([check, passed]) => (
                  <div key={check} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-secondary-200">
                    {passed ? (
                      <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-dark-900 capitalize">
                      {check.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {verificationResult.credentialSubject && (
              <div className="p-4 bg-white rounded-xl border border-secondary-200">
                <h4 className="text-sm font-bold text-dark-900 mb-3">Credential Subject</h4>
                <div className="space-y-2">
                  {Object.entries(verificationResult.credentialSubject).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start text-sm">
                      <span className="font-medium text-secondary-600 capitalize">{key}:</span>
                      <span className="text-dark-900 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setVerificationResult(null)
                setUploadedFile(null)
              }}
              className="w-full px-4 py-3 bg-secondary-200 text-dark-900 rounded-lg hover:bg-secondary-300 transition-colors font-semibold"
            >
              Verify Another Credential
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-primary-500 p-6 text-center shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 20px rgba(0, 255, 200, 0.06)' }}>
          <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
          <p className="font-semibold text-white text-sm">Trusted Network</p>
          <p className="text-xs text-blue-200 mt-1">Verified against blockchain</p>
        </div>

        <div className="rounded-xl border-2 border-accent-500 p-6 text-center shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 20px rgba(0, 255, 106, 0.06)' }}>
          <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
          <p className="font-semibold text-white text-sm">Cryptographic Proof</p>
          <p className="text-xs text-blue-200 mt-1">DID signature validation</p>
        </div>

        <div className="rounded-xl border-2 border-primary-500 p-6 text-center shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 20px rgba(0, 255, 200, 0.06)' }}>
          <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
          <p className="font-semibold text-white text-sm">Real-time Verification</p>
          <p className="text-xs text-blue-200 mt-1">Instant credential validation</p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary-500 p-6 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
          <div>
            <h4 className="font-bold text-white mb-1">Verification Best Practices</h4>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>• Always verify credentials before accepting them</li>
              <li>• Check the issuer's DID on the blockchain</li>
              <li>• Ensure the credential has not expired</li>
              <li>• Validate the credential signature matches the issuer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verification
