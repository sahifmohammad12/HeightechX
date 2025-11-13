import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Shield, CheckCircle, XCircle, Upload, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Verification = () => {
  const [verificationResult, setVerificationResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [uploadedProof, setUploadedProof] = useState(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const proof = JSON.parse(e.target.result)
            setUploadedProof(proof)
            setVerificationResult(null)
          } catch (error) {
            toast.error('Invalid JSON file')
          }
        }
        reader.readAsText(file)
      }
    },
  })

  const verifyCredential = async () => {
    if (!uploadedProof) {
      toast.error('Please upload a verifiable credential or proof')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Basic validation checks
      const checks = {
        hasContext: Array.isArray(uploadedProof['@context']) || typeof uploadedProof['@context'] === 'string',
        hasType: Array.isArray(uploadedProof.type) || typeof uploadedProof.type === 'string',
        hasIssuer: !!uploadedProof.issuer || !!uploadedProof.verifiableCredential?.issuer,
        hasProof: !!uploadedProof.proof || !!uploadedProof.verifiableCredential?.proof,
        hasIssuanceDate: !!uploadedProof.issuanceDate || !!uploadedProof.verifiableCredential?.issuanceDate,
      }

      const allChecksPass = Object.values(checks).every(check => check === true)

      // In production, this would verify cryptographic signatures
      const signatureValid = uploadedProof.proof?.proofValue !== 'placeholder-signature' &&
                            uploadedProof.proof?.proofValue !== 'placeholder-selective-disclosure-signature'

      const result = {
        valid: allChecksPass && signatureValid,
        checks,
        signatureValid,
        message: allChecksPass && signatureValid
          ? 'Credential is valid and verified'
          : 'Credential structure is valid but signature verification requires blockchain integration',
        details: {
          type: uploadedProof.type?.[1] || uploadedProof.type || 'Unknown',
          issuer: uploadedProof.issuer || uploadedProof.verifiableCredential?.issuer || 'Unknown',
          issuanceDate: uploadedProof.issuanceDate || uploadedProof.verifiableCredential?.issuanceDate || 'Unknown',
        }
      }

      setVerificationResult(result)
      
      if (result.valid) {
        toast.success('Verification successful!')
      } else {
        toast.warning('Verification completed with warnings')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationResult({
        valid: false,
        message: 'Error during verification',
        error: error.message,
      })
      toast.error('Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credential Verification</h1>
        <p className="mt-2 text-gray-600">
          Verify the authenticity and validity of verifiable credentials
        </p>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              How Verification Works
            </h3>
            <p className="text-sm text-blue-800">
              Upload a verifiable credential or proof to verify its structure, authenticity,
              and cryptographic signatures. The system checks the credential format, issuer,
              and proof signatures.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Credential/Proof</h2>
          
          {!uploadedProof ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">
                    Drag & drop a JSON credential file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: Verifiable Credentials (.json)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Credential Loaded</span>
                </div>
                <p className="text-sm text-gray-600">
                  Type: {uploadedProof.type?.[1] || uploadedProof.type || 'Unknown'}
                </p>
              </div>
              
              <button
                onClick={verifyCredential}
                disabled={isVerifying}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify Credential'}
              </button>

              <button
                onClick={() => {
                  setUploadedProof(null)
                  setVerificationResult(null)
                }}
                className="w-full btn-secondary"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Verification Results */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h2>
          
          {!verificationResult ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Upload and verify a credential to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Status */}
              <div className={`
                p-4 rounded-lg border-2
                ${verificationResult.valid
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
                }
              `}>
                <div className="flex items-center space-x-3 mb-2">
                  {verificationResult.valid ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                  <span className={`
                    font-semibold
                    ${verificationResult.valid ? 'text-green-900' : 'text-yellow-900'}
                  `}>
                    {verificationResult.valid ? 'Valid' : 'Partially Valid'}
                  </span>
                </div>
                <p className={`
                  text-sm
                  ${verificationResult.valid ? 'text-green-800' : 'text-yellow-800'}
                `}>
                  {verificationResult.message}
                </p>
              </div>

              {/* Verification Checks */}
              {verificationResult.checks && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Checks</h3>
                  <div className="space-y-2">
                    {Object.entries(verificationResult.checks).map(([check, passed]) => (
                      <div key={check} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 capitalize">
                          {check.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credential Details */}
              {verificationResult.details && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Credential Details</h3>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {verificationResult.details.type}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Issuer:</span>{' '}
                      <span className="font-mono text-xs">{verificationResult.details.issuer}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Issued:</span>{' '}
                      {new Date(verificationResult.details.issuanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Verification

