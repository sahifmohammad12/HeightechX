import { useState } from 'react'
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

  const handleMouseDown = (e) => {
    setIsClicked(true)
    
    // Create popup effect
    const rect = e.currentTarget.getBoundingClientRect()
    const popup = {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    setPopups([...popups, popup])

    // Remove popup after animation
    setTimeout(() => {
      setPopups(p => p.filter(pop => pop.id !== popup.id))
    }, 800)
  }

  const handleMouseUp = () => {
    setIsClicked(false)
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <Icon 
        className={`w-5 h-5 transition-all duration-200 ${
          isClicked ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Popup effect container */}
      {popups.map(popup => (
        <div key={popup.id} className="fixed pointer-events-none">
          <div
            className="absolute animate-popup"
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex items-center justify-center">
              {/* Popup burst particles */}
              <div className="absolute w-2 h-2 bg-primary-500 rounded-full animate-burst-1" />
              <div className="absolute w-2 h-2 bg-primary-400 rounded-full animate-burst-2" />
              <div className="absolute w-2 h-2 bg-accent-500 rounded-full animate-burst-3" />
              <div className="absolute w-1.5 h-1.5 bg-primary-300 rounded-full animate-burst-4" />
            </div>
          </div>
        </div>
      ))}
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
    <div className="min-h-screen" style={{background: 'var(--background)', perspective: '1200px'}}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
      style={{
        background: 'linear-gradient(180deg, var(--secondary) 0%, rgba(4,16,23,0.7) 40%)',
        borderRight: '2px solid var(--primary)',
        boxShadow: '2px 0 30px rgba(0,255,160,0.06)'
      }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4" style={{borderBottom: '2px solid rgba(0,255,160,0.06)'}}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary), var(--accent))', boxShadow: '0 0 18px rgba(0,255,160,0.08)'}}>
                <Shield className="w-5 h-5" style={{color: '#001014'}} />
              </div>
              <span className="text-xl font-bold" style={{color: 'var(--primary)', textShadow: '0 0 10px rgba(0,255,160,0.12)'}}>TruelDent</span>
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
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      color: active ? 'var(--accent)' : 'var(--primary)',
                      background: active ? 'rgba(0,255,106,0.08)' : 'transparent',
                      border: active ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.02)',
                      boxShadow: active ? '0 0 15px rgba(0,255,160,0.12)' : 'none',
                      fontWeight: active ? '600' : '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,255,160,0.04)';
                      e.currentTarget.style.border = '1px solid var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,160,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.02)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                >
                  <IconWrapper Icon={Icon} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Wallet Connection */}
          <div style={{padding: '16px', borderTop: '1px solid rgba(255,255,255,0.02)'}}>
            {account ? (
              <div className="space-y-2">
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#00ff41'}}>
                  <Wallet className="w-4 h-4" />
                  <span className="truncate" style={{textShadow: '0 0 6px rgba(0,255,160,0.12)', color: 'var(--accent)'}}>{account.slice(0, 6)}...{account.slice(-4)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 23, 68, 0.06)',
                    color: '#ff6b74',
                    border: '1px solid rgba(255,107,116,0.14)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 10px rgba(255, 23, 68, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,107,116,0.12)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255,107,116,0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,23,68,0.06)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255,107,116,0.06)';
                  }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: '#001014',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 26px rgba(0,255,160,0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,160,0.12)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 26px rgba(0,255,160,0.08)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
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
        <header className="sticky top-0 z-10" style={{background: 'rgba(0,4,10,0.6)', borderBottom: '1px solid rgba(255,255,255,0.02)'}}>
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              style={{color: 'var(--text)'}}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <span style={{color: 'var(--text)'}} className="text-sm">Security-First Identity Platform</span>
            </div>
            <div className="flex-1" />
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

