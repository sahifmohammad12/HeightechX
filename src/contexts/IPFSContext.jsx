import { createContext, useContext, useState } from 'react'
import { create } from 'ipfs-http-client'
import toast from 'react-hot-toast'

const IPFSContext = createContext()

export const useIPFS = () => {
  const context = useContext(IPFSContext)
  if (!context) {
    throw new Error('useIPFS must be used within an IPFSProvider')
  }
  return context
}

export const IPFSProvider = ({ children }) => {
  const [ipfs, setIpfs] = useState(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const initializeIPFS = async () => {
    if (ipfs) return ipfs

    setIsInitializing(true)
    try {
      // Check for Infura credentials
      const infuraProjectId = import.meta.env.VITE_INFURA_PROJECT_ID
      const infuraProjectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET

      let ipfsClient

      if (infuraProjectId && infuraProjectSecret) {
        // Using Infura IPFS
        ipfsClient = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: `Basic ${btoa(`${infuraProjectId}:${infuraProjectSecret}`)}`
          }
        })
      } else {
        // Fallback to public IPFS gateway
        ipfsClient = create({
          host: 'ipfs.io',
          port: 443,
          protocol: 'https',
          apiPath: '/api/v0'
        })
      }

      setIpfs(ipfsClient)
      toast.success('IPFS initialized')
      return ipfsClient
    } catch (error) {
      console.error('Error initializing IPFS:', error)
      // Use a mock IPFS for development
      const mockIPFS = {
        add: async (data) => {
          // Mock IPFS hash generation
          const hash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          return { path: hash, cid: { toString: () => hash } }
        },
        cat: async function* (hash) {
          yield new Uint8Array()
        }
      }
      setIpfs(mockIPFS)
      toast.info('Using mock IPFS (configure IPFS for production)')
      return mockIPFS
    } finally {
      setIsInitializing(false)
    }
  }

  const uploadToIPFS = async (file) => {
    const currentIpfs = ipfs || await initializeIPFS()

    setIsUploading(true)
    try {
      const fileBuffer = await file.arrayBuffer()
      const result = await currentIpfs.add(new Uint8Array(fileBuffer))
      const hash = result.path || (result.cid ? result.cid.toString() : result.toString())
      
      toast.success('File uploaded to IPFS')
      return {
        hash,
        url: `https://ipfs.io/ipfs/${hash}`,
        gateway: `https://gateway.ipfs.io/ipfs/${hash}`,
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      toast.error('Failed to upload to IPFS')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const uploadJSONToIPFS = async (data) => {
    const currentIpfs = ipfs || await initializeIPFS()

    setIsUploading(true)
    try {
      const jsonString = JSON.stringify(data)
      const jsonBuffer = new TextEncoder().encode(jsonString)
      const result = await currentIpfs.add(jsonBuffer)
      const hash = result.path || (result.cid ? result.cid.toString() : result.toString())
      
      toast.success('Data uploaded to IPFS')
      return {
        hash,
        url: `https://ipfs.io/ipfs/${hash}`,
        gateway: `https://gateway.ipfs.io/ipfs/${hash}`,
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      toast.error('Failed to upload to IPFS')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const retrieveFromIPFS = async (hash) => {
    const currentIpfs = ipfs || await initializeIPFS()

    try {
      const chunks = []
      for await (const chunk of currentIpfs.cat(hash)) {
        chunks.push(chunk)
      }
      const data = new Uint8Array(chunks.reduce((acc, chunk) => {
        const chunkArray = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)
        return [...acc, ...chunkArray]
      }, []))
      return data
    } catch (error) {
      console.error('Error retrieving from IPFS:', error)
      toast.error('Failed to retrieve from IPFS')
      return null
    }
  }

  const value = {
    ipfs,
    isInitializing,
    isUploading,
    initializeIPFS,
    uploadToIPFS,
    uploadJSONToIPFS,
    retrieveFromIPFS,
  }

  return (
    <IPFSContext.Provider value={value}>
      {children}
    </IPFSContext.Provider>
  )
}

