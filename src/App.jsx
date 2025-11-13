import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { DIDProvider } from './contexts/DIDContext'
import { CredentialProvider } from './contexts/CredentialContext'
import { IPFSProvider } from './contexts/IPFSContext'
import { WalletProvider } from './contexts/WalletContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import DIDManagement from './pages/DIDManagement'
import CredentialManagement from './pages/CredentialManagement'
import CredentialUpload from './pages/CredentialUpload'
import CredentialView from './pages/CredentialView'
import SelectiveDisclosure from './pages/SelectiveDisclosure'
import Verification from './pages/Verification'
import Settings from './pages/Settings'

function App() {
  return (
    <WalletProvider>
      <DIDProvider>
        <CredentialProvider>
          <IPFSProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/did" element={<DIDManagement />} />
                  <Route path="/credentials" element={<CredentialManagement />} />
                  <Route path="/credentials/upload" element={<CredentialUpload />} />
                  <Route path="/credentials/view/:id" element={<CredentialView />} />
                  <Route path="/disclosure" element={<SelectiveDisclosure />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
              <Toaster position="top-right" />
            </Router>
          </IPFSProvider>
        </CredentialProvider>
      </DIDProvider>
    </WalletProvider>
  )
}

export default App

