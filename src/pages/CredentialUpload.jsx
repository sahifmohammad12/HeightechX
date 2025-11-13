import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useDID } from '../contexts/DIDContext'
import { useCredential } from '../contexts/CredentialContext'
import { useIPFS } from '../contexts/IPFSContext'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CredentialUpload = () => {
  const navigate = useNavigate()
  const { did } = useDID()
  const { addCredential, isLoading: credentialLoading } = useCredential()
  const { uploadToIPFS, isUploading } = useIPFS()
  
  const [formData, setFormData] = useState({
    type: 'Aadhaar',
    name: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [ipfsHash, setIpfsHash] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedFile(file)
        
        // Upload to IPFS
        const result = await uploadToIPFS(file)
        if (result) {
          setIpfsHash(result.hash)
        }
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setIpfsHash(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!did) {
      toast.error('Please generate your DID first')
      navigate('/did')
      return
    }

    if (!uploadedFile && !ipfsHash) {
      toast.error('Please upload a document file')
      return
    }

    setIsSubmitting(true)
    try {
      const credentialData = {
        type: formData.type,
        subject: {
          name: formData.name,
          idNumber: formData.idNumber,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
        },
        ipfsHash: ipfsHash,
        fileName: uploadedFile?.name,
        fileType: uploadedFile?.type,
      }

      await addCredential(credentialData)
      toast.success('Credential uploaded successfully!')
      
      // Reset form
      setFormData({
        type: 'Aadhaar',
        name: '',
        idNumber: '',
        dateOfBirth: '',
        address: '',
      })
      setUploadedFile(null)
      setIpfsHash(null)
      
      // Navigate to credentials page
      setTimeout(() => navigate('/credentials'), 1500)
    } catch (error) {
      console.error('Error submitting credential:', error)
      toast.error('Failed to upload credential')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!did) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Credential</h1>
          <p className="mt-2 text-gray-600">
            Upload and store your verifiable credentials
          </p>
        </div>
        <div className="card text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            DID Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please generate your DID first to upload credentials
          </p>
          <button
            onClick={() => navigate('/did')}
            className="btn-primary"
          >
            Generate DID
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Credential</h1>
        <p className="mt-2 text-gray-600">
          Create a verifiable credential and store it securely on IPFS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credential Type */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credential Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="Aadhaar">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            <option value="DrivingLicense">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="AcademicCertificate">Academic Certificate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Credential Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Credential Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h2>
          
          {!uploadedFile ? (
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
                    Drag & drop a document here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: PDF, PNG, JPG (Max 10MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {ipfsHash && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Uploaded to IPFS</span>
                    </div>
                  )}
                  {isUploading && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {ipfsHash && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-1">IPFS Hash:</p>
                  <p className="text-xs font-mono text-green-800 break-all">{ipfsHash}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/credentials')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || credentialLoading || isUploading || !ipfsHash}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || credentialLoading ? 'Creating Credential...' : 'Create Verifiable Credential'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CredentialUpload

