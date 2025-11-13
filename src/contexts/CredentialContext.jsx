import { createContext, useContext, useState, useEffect } from 'react'
import { useDID } from './DIDContext'
import toast from 'react-hot-toast'

const CredentialContext = createContext()

export const useCredential = () => {
  const context = useContext(CredentialContext)
  if (!context) {
    throw new Error('useCredential must be used within a CredentialProvider')
  }
  return context
}

export const CredentialProvider = ({ children }) => {
  const { did } = useDID()
  const [credentials, setCredentials] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (did) {
      loadCredentials()
    } else {
      setCredentials([])
    }
  }, [did])

  const loadCredentials = () => {
    try {
      const stored = localStorage.getItem(`credentials_${did}`)
      if (stored) {
        setCredentials(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading credentials:', error)
    }
  }

  const saveCredentials = (newCredentials) => {
    try {
      localStorage.setItem(`credentials_${did}`, JSON.stringify(newCredentials))
      setCredentials(newCredentials)
    } catch (error) {
      console.error('Error saving credentials:', error)
      toast.error('Failed to save credentials')
    }
  }

  const addCredential = async (credentialData) => {
    if (!did) {
      toast.error('Please generate a DID first')
      return null
    }

    setIsLoading(true)
    try {
      const credential = {
        id: `vc:${Date.now()}`,
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1'
        ],
        type: ['VerifiableCredential', credentialData.type || 'IdentityCredential'],
        issuer: did,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: did,
          ...credentialData.subject,
        },
        proof: {
          type: 'EcdsaSecp256k1Signature2019',
          created: new Date().toISOString(),
          verificationMethod: `${did}#controller`,
          // In production, this would be a real cryptographic signature
          proofValue: 'placeholder-signature',
        },
        metadata: {
          ipfsHash: credentialData.ipfsHash,
          fileName: credentialData.fileName,
          fileType: credentialData.fileType,
        },
      }

      const updated = [...credentials, credential]
      saveCredentials(updated)
      toast.success('Credential added successfully')
      return credential
    } catch (error) {
      console.error('Error adding credential:', error)
      toast.error('Failed to add credential')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const removeCredential = (credentialId) => {
    const updated = credentials.filter(c => c.id !== credentialId)
    saveCredentials(updated)
    toast.success('Credential removed')
  }

  const getCredential = (credentialId) => {
    return credentials.find(c => c.id === credentialId)
  }

  const value = {
    credentials,
    isLoading,
    addCredential,
    removeCredential,
    getCredential,
    loadCredentials,
  }

  return (
    <CredentialContext.Provider value={value}>
      {children}
    </CredentialContext.Provider>
  )
}

