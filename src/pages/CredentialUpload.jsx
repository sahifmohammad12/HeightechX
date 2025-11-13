import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCredential } from '../contexts/CredentialContext'
import { useDID } from '../contexts/DIDContext'
import { useIPFS } from '../contexts/IPFSContext'
import { Upload, ArrowLeft, CheckCircle, AlertCircle, Lock, Shield } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const CredentialUpload = () => {
  const navigate = useNavigate()
  const { addCredential } = useCredential()
  const { did } = useDID()
  const { uploadFile } = useIPFS()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [ipfsHash, setIpfsHash] = useState(null)
  const [formData, setFormData] = useState({
    type: 'VerifiableCredential',
    credentialType: 'EducationCredential',
    name: '',
    email: '',
    issuer: '',
    issuanceDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
  })

  if (!did) {
    return (
      <div className="space-y-8 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="rounded-xl border-2 border-primary-500 p-6 text-center py-16 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
          <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">DID Required</h3>
          <p className="text-blue-200 mb-8 text-lg">
            Generate your Decentralized Identifier first
          </p>
        </div>
      </div>
    )
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedFile(file)
        setLoading(true)
        try {
          const hash = await uploadFile(file)
          setIpfsHash(hash)
          toast.success('File uploaded to IPFS!')
          setStep(3)
        } catch (error) {
          toast.error('Failed to upload file to IPFS')
        } finally {
          setLoading(false)
        }
      }
    },
    accept: {
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newCredential = {
        id: `cred_${Date.now()}`,
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: [formData.type, formData.credentialType],
        issuer: formData.issuer || did,
        issuanceDate: formData.issuanceDate,
        expirationDate: formData.expirationDate || null,
        credentialSubject: {
          id: did,
          name: formData.name,
          email: formData.email,
        },
        metadata: {
          uploadedAt: new Date().toISOString(),
          ipfsHash: ipfsHash || null,
        },
      }

      addCredential(newCredential)
      toast.success('Credential uploaded successfully!')
      setTimeout(() => navigate('/credentials'), 1500)
    } catch (error) {
      toast.error('Failed to upload credential')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div>
        <h1 className="text-4xl font-bold text-dark-900 mb-2">Upload Credential</h1>
        <p className="text-secondary-600 text-lg">
          Create and upload a new verifiable credential
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`card text-center py-4 transition-all duration-300 ${
            step >= s ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-primary-300' : 'bg-secondary-50 border-secondary-200'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold transition-all duration-300 ${
              step >= s ? 'bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg' : 'bg-secondary-400'
            }`}>
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            <p className={`font-semibold ${step >= s ? 'text-dark-900' : 'text-secondary-600'}`}>
              {s === 1 ? 'Details' : s === 2 ? 'Upload' : 'Review'}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="card space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Credential Type
              </label>
              <select
                name="credentialType"
                value={formData.credentialType}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="EducationCredential">Education Credential</option>
                <option value="IdentityCredential">Identity Credential</option>
                <option value="ProofOfResidence">Proof of Residence</option>
                <option value="ProfessionalCertification">Professional Certification</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Issuer DID
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  placeholder={did}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Issuance Date
                </label>
                <input
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full"
            >
              Next: Upload File
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-300 bg-secondary-50 hover:border-primary-500'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>
              {uploadedFile ? (
                <>
                  <p className="text-lg font-semibold text-dark-900 mb-2">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-dark-900 mb-2">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your credential file'}
                  </p>
                  <p className="text-sm text-secondary-600">
                    or click to browse (JSON, PDF, DOC, DOCX)
                  </p>
                </>
              )}
            </div>

            {ipfsHash && (
              <div className="p-4 bg-accent-50 border-l-4 border-accent-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="font-semibold text-accent-900">File uploaded to IPFS</p>
                    <p className="text-xs font-mono text-accent-700 mt-1 break-all">{ipfsHash}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!uploadedFile}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-dark-900">Review Your Credential</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Type</p>
                  <p className="text-sm font-medium text-dark-900">{formData.credentialType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium text-dark-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-dark-900">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Issued</p>
                  <p className="text-sm font-medium text-dark-900">{formData.issuanceDate}</p>
                </div>
              </div>

              {uploadedFile && (
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Attached File</p>
                  <p className="text-sm font-medium text-dark-900">{uploadedFile.name}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900 text-sm">Cryptographically Signed</p>
                  <p className="text-xs text-secondary-600">Your DID will sign this credential</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900 text-sm">IPFS Stored</p>
                  <p className="text-xs text-secondary-600">Immutably stored on IPFS</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Credential'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default CredentialUpload
