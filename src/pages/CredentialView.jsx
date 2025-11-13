import { useParams, useNavigate } from 'react-router-dom'
import { useCredential } from '../contexts/CredentialContext'
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

const CredentialView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCredential } = useCredential()
  const [copied, setCopied] = useState(false)

  const credential = getCredential(id)

  if (!credential) {
    return (
      <div className="space-y-6">
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Credential not found</p>
          <button onClick={() => navigate('/credentials')} className="btn-primary">
            Back to Credentials
          </button>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/credentials')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credential Details</h1>
          <p className="mt-2 text-gray-600">
            View full details of your verifiable credential
          </p>
        </div>
      </div>

      {/* Credential Info */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {credential.type[1] || 'Credential'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Issued {new Date(credential.issuanceDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </span>
          </div>
        </div>

        {/* Credential Subject */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Credential Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(credential.credentialSubject || {}).map(([key, value]) => {
              if (key === 'id') return null
              return (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-900">{value}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Issuer Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Issuer</h3>
          <p className="text-sm font-mono text-blue-800 break-all">{credential.issuer}</p>
        </div>

        {/* IPFS Hash */}
        {credential.metadata?.ipfsHash && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">IPFS Hash</h3>
              <button
                onClick={() => copyToClipboard(credential.metadata.ipfsHash)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-mono text-gray-700 break-all">
                {credential.metadata.ipfsHash}
              </p>
              <a
                href={`https://ipfs.io/ipfs/${credential.metadata.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
              >
                View on IPFS →
              </a>
            </div>
          </div>
        )}

        {/* Full JSON */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Full Credential JSON</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(credential, null, 2))}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(credential, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `${credential.type[1] || 'credential'}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(credential, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CredentialView

