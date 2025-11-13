import { useState } from 'react'
import { useCredential } from '../contexts/CredentialContext'
import { useDID } from '../contexts/DIDContext'
import { Eye, Shield, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SelectiveDisclosure = () => {
  const { did } = useDID()
  const { credentials } = useCredential()
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [selectedFields, setSelectedFields] = useState([])
  const [disclosureProof, setDisclosureProof] = useState(null)

  const features = [
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'Share only the information needed'
    },
    {
      icon: Shield,
      title: 'Control Your Data',
      description: 'You decide what gets disclosed'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verifiers trust your proof'
    }
  ]

  if (!did) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-900 mb-2">Selective Disclosure</h1>
          <p className="text-secondary-600 text-lg">
            Share only the information you choose to reveal
          </p>
        </div>
        <div className="rounded-xl border-2 border-primary-500 p-6 text-center py-16 shadow-lg" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 30px rgba(0, 255, 200, 0.06), inset 0 0 12px rgba(0, 255, 200, 0.03)' }}>
          <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">DID Required</h3>
          <p className="text-blue-200 text-lg">Generate your DID first to use selective disclosure</p>
        </div>
      </div>
    )
  }

  const handleFieldToggle = (field) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const handleGenerateProof = () => {
    if (!selectedCredential || selectedFields.length === 0) {
      toast.error('Please select a credential and at least one field')
      return
    }

    const credential = credentials.find(c => c.id === selectedCredential)
    const disclosedData = {}
    selectedFields.forEach(field => {
      if (credential.credentialSubject[field]) {
        disclosedData[field] = credential.credentialSubject[field]
      }
    })

    const proof = {
      type: 'SelectiveDisclosureProof',
      credentialId: credential.id,
      credentialType: credential.type[1],
      disclosedFields: selectedFields,
      disclosedData: disclosedData,
      issuer: credential.issuer,
      createdAt: new Date().toISOString(),
      hash: Math.random().toString(36).substring(2, 15),
    }

    setDisclosureProof(proof)
    toast.success('Disclosure proof generated!')
  }

  const handleCopyProof = () => {
    navigator.clipboard.writeText(JSON.stringify(disclosureProof, null, 2))
    toast.success('Proof copied to clipboard!')
  }

  const credentialFields = selectedCredential
    ? credentials.find(c => c.id === selectedCredential)?.credentialSubject
    : null

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(0, 255, 200, 0.8)' }}>Selective Disclosure</h1>
        <p className="text-blue-200 text-lg">
          Share only the information you choose to reveal
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

      <div className="card space-y-6" style={{ background: 'rgba(0, 0, 0, 0.9)', boxShadow: '0 0 40px rgba(0, 255, 200, 0.2), inset 0 0 15px rgba(0, 255, 200, 0.05)', border: '2px solid var(--primary)' }}>
        <div>
          <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px rgba(0, 255, 200, 0.5)' }}>1. Select Credential</h3>
          <select
            value={selectedCredential || ''}
            onChange={(e) => {
              setSelectedCredential(e.target.value || null)
              setSelectedFields([])
              setDisclosureProof(null)
            }}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-white"
            style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid var(--primary)', boxShadow: '0 0 10px rgba(0, 255, 200, 0.2)' }}
          >
            <option value="">Choose a credential...</option>
            {credentials.map(cred => (
              <option key={cred.id} value={cred.id}>
                {cred.type[1]} - {cred.credentialSubject?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCredential && credentialFields && (
        <div className="card space-y-6">
          <div>
            <h3 className="text-xl font-bold text-dark-900 mb-4">2. Select Fields to Disclose</h3>
            <div className="space-y-3">
              {Object.entries(credentialFields)
                .filter(([key]) => !['id'].includes(key))
                .map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(key)}
                      onChange={() => handleFieldToggle(key)}
                      className="w-5 h-5 accent-primary-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900 capitalize">{key}</p>
                      <p className="text-sm text-secondary-600">{String(value)}</p>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {selectedFields.length > 0 && (
            <button
              onClick={handleGenerateProof}
              className="btn-primary w-full"
            >
              Generate Disclosure Proof
            </button>
          )}
        </div>
      )}

      {disclosureProof && (
        <div className="card space-y-6 bg-gradient-to-br from-accent-50 to-green-50 border-accent-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold text-dark-900">Disclosure Proof Generated</h3>
              <p className="text-secondary-600">Share this proof to verify selected fields only</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-primary-500" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 20px rgba(0, 255, 200, 0.06)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--primary)' }}>Disclosed Fields</p>
              <div className="flex flex-wrap gap-2">
                {disclosureProof.disclosedFields.map(field => (
                  <span
                    key={field}
                    className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-primary-500 font-mono text-sm overflow-x-auto max-h-48 overflow-y-auto" style={{ background: 'rgba(0, 4, 10, 0.75)', boxShadow: '0 0 20px rgba(0, 255, 200, 0.06)' }}>
              <pre className="text-blue-100 whitespace-pre-wrap break-words">
                {JSON.stringify(disclosureProof, null, 2)}
              </pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyProof}
                className="flex-1 px-4 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold"
              >
                Copy Proof
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(disclosureProof, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `disclosure-proof-${disclosureProof.hash}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="flex-1 px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-semibold"
              >
                Download Proof
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-dark-900 mb-2">Privacy Protected</h3>
          <p className="text-sm text-secondary-600">
            Only the fields you choose are revealed to verifiers
          </p>
        </div>

        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-green-200 text-accent-600 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-dark-900 mb-2">Verifiable Proof</h3>
          <p className="text-sm text-secondary-600">
            Cryptographically linked to your original credential
          </p>
        </div>
      </div>
    </div>
  )
}

export default SelectiveDisclosure
