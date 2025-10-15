import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Scan, BookOpen, Building2, BarChart3, UserCheck, Settings, FileText, LogIn, ChevronDown, Shield, Users, Camera, Upload, Eye, BarChart, Cog } from 'lucide-react';
import ICChipLogo from './ICChipLogo';

export default function Layout({ children, currentPage = 'home', showLogin = false, isAdminMode = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Context-aware navigation based on current page
  const getNavigation = () => {
    // Admin-only navigation when in admin mode
    if (isAdminMode) {
      return [
        { 
          name: 'Home', 
          href: '/', 
          icon: Home 
        },
        { 
          name: 'Admin Dashboard', 
          href: '/admin', 
          icon: Settings 
        },
        { 
          name: 'System Overview', 
          href: '/admin?tab=overview', 
          icon: BarChart3 
        },
        { 
          name: 'Manufacturers', 
          href: '/admin?tab=manufacturers', 
          icon: Building2 
        },
        { 
          name: 'Analytics', 
          href: '/admin?tab=analytics', 
          icon: FileText 
        },
        { 
          name: 'Users', 
          href: '/admin?tab=users', 
          icon: Users 
        }
      ];
    }

    const baseNav = [
      { 
        name: 'Home', 
        href: '/', 
        icon: Home,
        show: ['home', 'manufacturer', 'operator', 'qa', 'admin', 'reports']
      }
    ];

    // Page-specific navigation
    switch (currentPage) {
      case 'operator':
        return [
          ...baseNav,
          { name: 'Dashboard', href: '/operator', icon: BarChart3, show: ['operator'] },
          { name: 'Quality Control', href: '/qa', icon: Eye, show: ['operator'] },
          { name: 'Admin Panel', href: '/admin', icon: Settings, show: ['operator'] }
        ];
      
      case 'qa':
        return [
          ...baseNav,
          { name: 'Scanning Interface', href: '/operator', icon: Camera, show: ['qa'] },
          { name: 'QA Dashboard', href: '/qa', icon: UserCheck, show: ['qa'] },
          { name: 'Admin Panel', href: '/admin', icon: Settings, show: ['qa'] }
        ];
      
      case 'admin':
        return [
          ...baseNav,
          { name: 'System Overview', href: '/admin', icon: Settings, show: ['admin'] },
          { name: 'Manufacturer Management', href: '/admin?tab=manufacturers', icon: Building2, show: ['admin'] },
          { name: 'Reports & Analytics', href: '/admin?tab=analytics', icon: BarChart, show: ['admin'] },
          { name: 'User Management', href: '/admin?tab=users', icon: Users, show: ['admin'] }
        ];
      
      case 'manufacturer':
        return [
          ...baseNav,
          { name: 'My Dashboard', href: '/manufacturer', icon: Building2, show: ['manufacturer'] },
          { name: 'Upload Data', href: '/manufacturer?action=upload', icon: Upload, show: ['manufacturer'] },
          { name: 'Admin Panel', href: '/admin', icon: Settings, show: ['manufacturer'] }
        ];
      
      default:
        return [
          ...baseNav,
          {
            name: 'Verification System',
            icon: Shield,
            dropdown: [
              { name: 'Manufacturer Portal', href: '/manufacturer', icon: Building2 },
              { name: 'Scanning Interface', href: '/operator', icon: Camera },
              { name: 'Quality Control', href: '/qa', icon: Eye }
            ]
          },
          { 
            name: 'Admin Panel', 
            href: '/admin', 
            icon: Settings 
          },
          { 
            name: 'Learning', 
            href: '/learning', 
            icon: BookOpen 
          }
        ];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Glass Morphism Effect - Hide in admin mode */}
      {!isAdminMode && (
        <nav className="relative bg-gradient-to-r from-white/20 via-blue-100/30 to-white/20 border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl shadow-2xl backdrop-saturate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo - VERITAS Branding */}
            <Link href="/" className="flex items-center gap-3 group">
              <ICChipLogo className="h-10 w-10 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xl font-bold text-gray-900 leading-tight">VERITAS</span>
            </Link>

            {/* Desktop Navigation - Enhanced with Dropdowns */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative group">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 backdrop-saturate-150">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-200 rounded-xl mx-2 group backdrop-blur-sm hover:backdrop-blur-md"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                                <dropdownItem.icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-900">{dropdownItem.name}</div>
                                {dropdownItem.description && (
                                  <div className="text-sm text-gray-500 group-hover:text-gray-600">{dropdownItem.description}</div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-sm"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Conditional Login Link */}
              {showLogin && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ml-4"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-50 rounded-lg">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      <div className="ml-6 mt-1 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <dropdownItem.icon className="h-4 w-4" />
                            <span>{dropdownItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Login Link */}
              {showLogin && (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 mx-4 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Minimal & Clean - Hide in admin mode */}
      {!isAdminMode && (
        <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-3">
              <ICChipLogo className="h-6 w-6 text-white" />
              <span className="font-bold text-white">VERITAS</span>
              <span className="text-gray-400">© 2025 BHEL</span>
            </div>
            
            {/* Footer Links - Minimal */}
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/manufacturer" className="hover:text-white transition-colors">
                Manufacturer Portal
              </Link>
              <Link href="/operator" className="hover:text-white transition-colors">
                Scanning Interface
              </Link>
              <Link href="/qa" className="hover:text-white transition-colors">
                Quality Control
              </Link>
              <Link href="/learning" className="hover:text-white transition-colors">
                Learning
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
        </footer>
      )}
    </div>
  );
}
