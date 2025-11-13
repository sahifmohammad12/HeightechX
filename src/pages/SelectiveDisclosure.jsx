import { useState } from 'react'
import { useCredential } from '../contexts/CredentialContext'
import { useDID } from '../contexts/DIDContext'
import { Eye, CheckCircle, FileText, Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const SelectiveDisclosure = () => {
  const { credentials } = useCredential()
  const { did } = useDID()
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [selectedFields, setSelectedFields] = useState([])
  const [disclosureProof, setDisclosureProof] = useState(null)

  if (!did) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selective Disclosure</h1>
          <p className="mt-2 text-gray-600">
            Share only the information you want to reveal
          </p>
        </div>
        <div className="card text-center py-12">
          <p className="text-gray-600">Please generate your DID first</p>
        </div>
      </div>
    )
  }

  const handleCredentialSelect = (credential) => {
    setSelectedCredential(credential)
    setSelectedFields([])
    setDisclosureProof(null)
  }

  const toggleField = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const generateDisclosure = () => {
    if (!selectedCredential || selectedFields.length === 0) {
      toast.error('Please select a credential and at least one field')
      return
    }

    // Create a selective disclosure proof
    const disclosedData = {}
    selectedFields.forEach(field => {
      if (selectedCredential.credentialSubject[field]) {
        disclosedData[field] = selectedCredential.credentialSubject[field]
      }
    })

    const proof = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: {
        id: selectedCredential.id,
        type: selectedCredential.type,
        issuer: selectedCredential.issuer,
        issuanceDate: selectedCredential.issuanceDate,
        credentialSubject: disclosedData,
        proof: {
          type: 'SelectiveDisclosureProof',
          disclosedFields: selectedFields,
          timestamp: new Date().toISOString(),
        }
      },
      holder: did,
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: new Date().toISOString(),
        verificationMethod: `${did}#controller`,
        proofValue: 'placeholder-selective-disclosure-signature',
      }
    }

    setDisclosureProof(proof)
    toast.success('Selective disclosure proof generated')
  }

  const availableFields = selectedCredential 
    ? Object.keys(selectedCredential.credentialSubject || {}).filter(key => key !== 'id')
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selective Disclosure</h1>
        <p className="mt-2 text-gray-600">
          Share only the specific information you want to reveal, maintaining privacy
        </p>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              What is Selective Disclosure?
            </h3>
            <p className="text-sm text-blue-800">
              Selective disclosure allows you to share only specific fields from your credentials
              instead of revealing the entire document. This enhances privacy and gives you control
              over what information you share.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credential Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Credential</h2>
          
          {credentials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No credentials available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {credentials.map((credential) => (
                <button
                  key={credential.id}
                  onClick={() => handleCredentialSelect(credential)}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-colors
                    ${selectedCredential?.id === credential.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {credential.type[1] || 'Credential'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(credential.issuanceDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedCredential?.id === credential.id && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Fields to Disclose</h2>
          
          {!selectedCredential ? (
            <div className="text-center py-8 text-gray-500">
              <p>Select a credential first</p>
            </div>
          ) : availableFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No fields available in this credential</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {availableFields.map((field) => (
                  <label
                    key={field}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedCredential.credentialSubject[field]}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={generateDisclosure}
                disabled={selectedFields.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Disclosure Proof
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Disclosure Proof */}
      {disclosureProof && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Disclosure Proof</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(disclosureProof, null, 2))
                  toast.success('Copied to clipboard')
                }}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(disclosureProof, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `disclosure-proof-${Date.now()}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(disclosureProof, null, 2)}
            </pre>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Disclosed Fields:</strong> {selectedFields.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectiveDisclosure

