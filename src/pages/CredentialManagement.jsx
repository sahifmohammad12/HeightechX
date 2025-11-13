import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCredential } from '../contexts/CredentialContext'
import { useDID } from '../contexts/DIDContext'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Search,
  Filter,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

const CredentialManagement = () => {
  const navigate = useNavigate()
  const { credentials, removeCredential } = useCredential()
  const { did } = useDID()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  if (!did) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credential Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your verifiable credentials
          </p>
        </div>
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            DID Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please generate your DID first to manage credentials
          </p>
          <Link to="/did" className="btn-primary inline-block">
            Generate DID
          </Link>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credential Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage your verifiable credentials
          </p>
        </div>
        <Link to="/credentials/upload" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Upload Credential</span>
        </Link>
      </div>

      {/* Search and Filter */}
      {credentials.length > 0 && (
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
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

      {/* Credentials Grid */}
      {credentials.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Credentials Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by uploading your first verifiable credential
          </p>
          <Link to="/credentials/upload" className="btn-primary inline-block">
            Upload Credential
          </Link>
        </div>
      ) : filteredCredentials.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No credentials match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential) => (
            <div key={credential.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <button
                  onClick={() => handleDelete(credential.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Delete credential"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {credential.type[1] || 'Credential'}
              </h3>

              <div className="space-y-2 mb-4">
                {credential.credentialSubject?.name && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {credential.credentialSubject.name}
                  </p>
                )}
                {credential.credentialSubject?.idNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> {credential.credentialSubject.idNumber}
                  </p>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(credential.issuanceDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {credential.metadata?.ipfsHash && (
                <div className="mb-4 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
                  IPFS: {credential.metadata.ipfsHash.slice(0, 20)}...
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/credentials/view/${credential.id}`)}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-2"
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
                  className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {credentials.length > 0 && (
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-600">
            Total Credentials: <span className="font-semibold">{credentials.length}</span>
            {filteredCredentials.length !== credentials.length && (
              <>
                {' '}• Showing: <span className="font-semibold">{filteredCredentials.length}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default CredentialManagement

