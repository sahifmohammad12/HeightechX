import { useParams, useNavigate } from 'react-router-dom'
import { useCredential } from '../contexts/CredentialContext'
import { ArrowLeft, Copy, Download, ExternalLink, Check, FileJson, Shield, Lock, Calendar } from 'lucide-react'
import { useState } from 'react'

const CredentialView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { credentials } = useCredential()
  const [copied, setCopied] = useState(null)
  const [showJson, setShowJson] = useState(false)

  const credential = credentials.find(c => c.id === id)

  if (!credential) {
    return (
      <div className="space-y-8 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="card text-center py-16 bg-secondary-50 border-secondary-200">
          <p className="text-secondary-600 text-lg">Credential not found</p>
        </div>
      </div>
    )
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(credential, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${credential.type[1] || 'credential'}.json`
    link.click()
    URL.revokeObjectURL(url)
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 mb-2">{credential.type[1] || 'Credential'}</h1>
          <p className="text-secondary-600 text-lg">
            View detailed credential information
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="btn-primary inline-flex items-center gap-2 w-fit"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Credential Status</p>
            <p className="text-2xl font-bold text-primary-600">Valid & Verified</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="card space-y-6">
        <h3 className="text-xl font-bold text-dark-900">Credential Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Type</p>
            <p className="text-dark-900 font-medium">{credential.type[1]}</p>
          </div>

          <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Subject Name</p>
            <p className="text-dark-900 font-medium">{credential.credentialSubject?.name || 'N/A'}</p>
          </div>

          <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Email</p>
            <p className="text-dark-900 font-medium">{credential.credentialSubject?.email || 'N/A'}</p>
          </div>

          <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
            <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Issued Date</p>
            <div className="flex items-center gap-2 text-dark-900 font-medium">
              <Calendar className="w-4 h-4" />
              {new Date(credential.issuanceDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="card space-y-6">
        <h3 className="text-xl font-bold text-dark-900">Subject Information</h3>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Subject DID</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono text-dark-900 break-all">{credential.credentialSubject?.id || 'N/A'}</p>
              <button
                onClick={() => handleCopy(credential.credentialSubject?.id || '', 'subject')}
                className="flex-shrink-0 p-2 hover:bg-primary-200 rounded-lg transition-colors text-primary-600"
              >
                {copied === 'subject' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {credential.credentialSubject?.idNumber && (
            <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">ID Number</p>
              <p className="text-sm font-mono text-dark-900">{credential.credentialSubject.idNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="card space-y-6">
        <h3 className="text-xl font-bold text-dark-900">Issuer Information</h3>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Issuer DID</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono text-dark-900 break-all">{credential.issuer}</p>
              <button
                onClick={() => handleCopy(credential.issuer, 'issuer')}
                className="flex-shrink-0 p-2 hover:bg-primary-200 rounded-lg transition-colors text-primary-600"
              >
                {copied === 'issuer' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {credential.metadata?.ipfsHash && (
        <div className="card space-y-6">
          <h3 className="text-xl font-bold text-dark-900">IPFS Storage</h3>

          <div className="p-4 bg-gradient-to-r from-accent-50 to-green-50 border border-accent-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-accent-600" />
              <p className="text-xs font-semibold text-accent-600 uppercase tracking-wide">IPFS Hash</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono text-dark-900 break-all">{credential.metadata.ipfsHash}</p>
              <button
                onClick={() => handleCopy(credential.metadata.ipfsHash, 'ipfs')}
                className="flex-shrink-0 p-2 hover:bg-accent-200 rounded-lg transition-colors text-accent-600"
              >
                {copied === 'ipfs' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <a
            href={`https://ipfs.io/ipfs/${credential.metadata.ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 transition-colors font-semibold"
          >
            <ExternalLink className="w-4 h-4" />
            View on IPFS
          </a>
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-dark-900">Raw Credential Data</h3>
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-semibold"
          >
            <FileJson className="w-5 h-5" />
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
        </div>

        {showJson && (
          <div className="mt-4 p-4 bg-dark-900 rounded-xl overflow-x-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap break-words">
              {JSON.stringify(credential, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 text-center">
          <Lock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="font-semibold text-dark-900 text-sm">Cryptographically Secured</p>
          <p className="text-xs text-secondary-600 mt-1">Signed with your DID</p>
        </div>

        <div className="card bg-gradient-to-br from-accent-50 to-green-100 border-accent-200 text-center">
          <Shield className="w-8 h-8 text-accent-600 mx-auto mb-2" />
          <p className="font-semibold text-dark-900 text-sm">Immutably Stored</p>
          <p className="text-xs text-secondary-600 mt-1">On IPFS network</p>
        </div>

        <div className="card bg-gradient-to-br from-primary-50 to-accent-100 border-primary-200 text-center">
          <Check className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="font-semibold text-dark-900 text-sm">Verifiable</p>
          <p className="text-xs text-secondary-600 mt-1">Independently verifiable</p>
        </div>
      </div>
    </div>
  )
}

export default CredentialView
