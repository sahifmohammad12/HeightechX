import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCredential } from '../contexts/CredentialContext'
import { useDID } from '../contexts/DIDContext'
import { FileText, Plus, Trash2, Eye, Download, Search, Filter, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CredentialManagement = () => {
  const navigate = useNavigate()
  const { credentials, removeCredential } = useCredential()
  const { did } = useDID()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  if (!did) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 mb-2">Credential Management</h1>
          <p className="text-secondary-600 text-lg">
            Manage and organize your verifiable credentials
          </p>
        </div>
        <div className="rounded-xl border-2 border-primary-500 p-6 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">DID Required</h3>
            <p className="text-blue-200 mb-8 max-w-md mx-auto text-lg">
              Please generate your Decentralized Identifier first to manage credentials
            </p>
            <Link to="/did" className="btn-primary inline-flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Generate DID
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = (credentialId) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      removeCredential(credentialId)
    }
  }

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.type[1]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.credentialSubject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || cred.type[1] === filterType
    return matchesSearch && matchesFilter
  })

  const credentialTypes = ['all', ...new Set(credentials.map(c => c.type[1]).filter(Boolean))]

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 mb-2">Credential Management</h1>
          <p className="text-secondary-600 text-lg">
            View and manage your verifiable credentials
          </p>
        </div>
        <Link to="/credentials/upload" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          <span>Upload Credential</span>
        </Link>
      </div>

      {credentials.length > 0 && (
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                {credentialTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {credentials.length === 0 ? (
        <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 text-center py-16">
          <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-dark-900 mb-2">No Credentials Yet</h3>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto text-lg">
            Start by uploading your first verifiable credential
          </p>
          <Link to="/credentials/upload" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Upload Credential
          </Link>
        </div>
      ) : filteredCredentials.length === 0 ? (
        <div className="card text-center py-16 bg-secondary-50 border-secondary-200">
          <p className="text-secondary-600 text-lg">No credentials match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential) => (
            <div key={credential.id} className="card hover:shadow-xl hover:border-primary-200 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <button
                  onClick={() => handleDelete(credential.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 text-red-600 opacity-0 group-hover:opacity-100"
                  title="Delete credential"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark-900">
                  {credential.type[1] || 'Credential'}
                </h3>
                <span className="inline-block mt-2 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                  Verified
                </span>
              </div>

              <div className="space-y-3 mb-6 py-4 border-y border-secondary-200">
                {credential.credentialSubject?.name && (
                  <div>
                    <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Name</p>
                    <p className="text-sm text-dark-900 font-medium">{credential.credentialSubject.name}</p>
                  </div>
                )}
                {credential.credentialSubject?.idNumber && (
                  <div>
                    <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">ID Number</p>
                    <p className="text-sm text-dark-900 font-mono">{credential.credentialSubject.idNumber}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-secondary-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(credential.issuanceDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {credential.metadata?.ipfsHash && (
                <div className="mb-4 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <p className="text-xs font-semibold text-secondary-600 mb-1 uppercase tracking-wide">IPFS Hash</p>
                  <p className="text-xs font-mono text-dark-700 break-all">{credential.metadata.ipfsHash.slice(0, 20)}...</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/credentials/view/${credential.id}`)}
                  className="flex-1 px-3 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
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
                  className="flex-1 px-3 py-2 rounded-lg bg-accent-100 text-accent-700 hover:bg-accent-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {credentials.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Total</p>
              <p className="text-2xl font-bold text-primary-600">{credentials.length}</p>
            </div>
            {filteredCredentials.length !== credentials.length && (
              <div>
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Showing</p>
                <p className="text-2xl font-bold text-accent-600">{filteredCredentials.length}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-1">Verified</p>
              <p className="text-2xl font-bold text-accent-600">{filteredCredentials.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CredentialManagement
