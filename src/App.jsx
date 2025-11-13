import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { DIDProvider } from './contexts/DIDContext'
import { CredentialProvider } from './contexts/CredentialContext'
import { IPFSProvider } from './contexts/IPFSContext'
import { WalletProvider } from './contexts/WalletContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
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
    <AuthProvider>
      <WalletProvider>
        <DIDProvider>
          <CredentialProvider>
            <IPFSProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
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
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Toaster position="top-right" />
              </Router>
            </IPFSProvider>
          </CredentialProvider>
        </DIDProvider>
      </WalletProvider>
    </AuthProvider>
  )
}

export default App

