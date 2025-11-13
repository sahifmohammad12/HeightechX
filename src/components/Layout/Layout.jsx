import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Fingerprint, 
  FileText, 
  Upload, 
  Eye, 
  Shield, 
  Settings,
  Menu,
  X,
  Wallet
} from 'lucide-react'
import { useWallet } from '../../contexts/WalletContext'

const IconWrapper = ({ Icon }) => {
  const [isClicked, setIsClicked] = useState(false)
  const [popups, setPopups] = useState([])
  const iconRef = useRef(null)

  const handleMouseDown = (e) => {
    setIsClicked(true)
    
    // Create pop-up effect
    const popup = {
      id: Date.now(),
      scale: 0,
    }
    setPopups([...popups, popup])

    // Animate pop-up
    setTimeout(() => {
      setPopups(prev => 
        prev.map(p => p.id === popup.id ? { ...p, scale: 1 } : p)
      )
    }, 50)

    // Remove popup after animation
    setTimeout(() => {
      setPopups(p => p.filter(pop => pop.id !== popup.id))
    }, 700)
  }

  const handleMouseUp = () => {
    setIsClicked(false)
  }

  return (
    <div className="relative inline-flex items-center justify-center cursor-pointer">
      {/* Pop-up rings */}
      {popups.map(popup => (
        <div
          key={popup.id}
          className="absolute rounded-full border-2 border-primary-400 pointer-events-none"
          style={{
            width: '30px',
            height: '30px',
            transform: `scale(${popup.scale})`,
            opacity: 1 - popup.scale,
            animation: 'popup-expand 0.7s ease-out forwards',
            left: '50%',
            top: '50%',
            marginLeft: '-15px',
            marginTop: '-15px',
          }}
        />
      ))}

      <Icon 
        ref={iconRef}
        className={`w-5 h-5 transition-all duration-300 ${
          isClicked ? 'scale-150 animate-bounce' : 'scale-100'
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Pop background glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isClicked ? 'bg-primary-400 opacity-40 scale-200 blur-sm' : 'bg-primary-400 opacity-0 scale-100'
        }`}
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { account, connectWallet, disconnectWallet } = useWallet()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'DID Management', href: '/did', icon: Fingerprint },
    { name: 'Credentials', href: '/credentials', icon: FileText },
    { name: 'Upload Credential', href: '/credentials/upload', icon: Upload },
    { name: 'Selective Disclosure', href: '/disclosure', icon: Eye },
    { name: 'Verification', href: '/verification', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DID Vault</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer
                    ${active 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <IconWrapper Icon={Icon} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Wallet Connection */}
          <div className="p-4 border-t border-gray-200">
            {account ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span className="truncate">{account.slice(0, 6)}...{account.slice(-4)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="w-full btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="w-full btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Decentralized Identity Vault</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

