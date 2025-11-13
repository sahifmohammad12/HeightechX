import { createContext, useContext, useState, useEffect } from 'react'
import { useWallet } from './WalletContext'
import toast from 'react-hot-toast'

const DIDContext = createContext()

export const useDID = () => {
  const context = useContext(DIDContext)
  if (!context) {
    throw new Error('useDID must be used within a DIDProvider')
  }
  return context
}

export const DIDProvider = ({ children }) => {
  const { account, signer } = useWallet()
  const [did, setDid] = useState(null)
  const [didDocument, setDidDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate DID from wallet address
  const generateDID = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return null
    }

    setIsLoading(true)
    try {
      // DID format: did:ethr:chainId:address
      // For now, using a simple format - in production, use proper DID method
      const chainId = await window.ethereum?.request({ method: 'eth_chainId' })
      const didString = `did:ethr:${chainId}:${account}`
      
      const didDoc = {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: didString,
        verificationMethod: [{
          id: `${didString}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: didString,
          blockchainAccountId: `${account}@eip155:${chainId}`,
        }],
        authentication: [`${didString}#controller`],
        assertionMethod: [`${didString}#controller`],
      }

      setDid(didString)
      setDidDocument(didDoc)
      
      // Store in localStorage
      localStorage.setItem('userDID', didString)
      localStorage.setItem('userDIDDocument', JSON.stringify(didDoc))
      
      toast.success('DID generated successfully')
      return didString
    } catch (error) {
      console.error('Error generating DID:', error)
      toast.error('Failed to generate DID')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const loadDID = () => {
    const storedDID = localStorage.getItem('userDID')
    const storedDIDDoc = localStorage.getItem('userDIDDocument')
    
    if (storedDID && storedDIDDoc) {
      setDid(storedDID)
      setDidDocument(JSON.parse(storedDIDDoc))
    }
  }

  useEffect(() => {
    if (account) {
      loadDID()
    } else {
      setDid(null)
      setDidDocument(null)
    }
  }, [account])

  const value = {
    did,
    didDocument,
    isLoading,
    generateDID,
    loadDID,
  }

  return (
    <DIDContext.Provider value={value}>
      {children}
    </DIDContext.Provider>
  )
}

