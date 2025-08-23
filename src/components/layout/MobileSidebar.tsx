import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type {MobileSidebarProps,NavigationItem} from '../../types';
import { 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  ArrowRightLeft, 
  Users, 
  Shield, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  User,
  MessageCircle,
  Settings as ManageIcon
} from 'lucide-react';



/**
 * Mobile sidebar component for responsive navigation
 * Slides in from the left on mobile devices
 */
const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['accounts']);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Accounts',
      icon: TrendingUp,
      submenu: [
        { name: 'Create Account', href: '/dashboard/trading-account', icon: Plus },
        { name: 'Manage Account', href: '/dashboard/manage-accounts', icon: ManageIcon },
        { name: 'Live Accounts', href: '/dashboard/live-accounts', icon: TrendingUp },
      ]
    },
    { name: 'KYC Verification', href: '/dashboard/kyc', icon: FileText },
    { name: 'Deposits', href: '/dashboard/deposits', icon: CreditCard },
    { name: 'Internal Transfer', href: '/dashboard/internal-transfer', icon: ArrowRightLeft },
    { name: 'IB Request', href: '/dashboard/ib-request', icon: Users },
    { name: '2FA Settings', href: '/dashboard/2fa', icon: Shield },
    { name: 'Support', href: '/dashboard/support', icon: MessageCircle },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName.toLowerCase());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />
        
        {/* Sidebar */}
        <div 
          className="fixed inset-y-0 left-0 z-50 w-64"
          style={{
            background: 'linear-gradient(349deg, rgba(12, 247, 114, 1) 0%, rgba(87, 199, 133, 1) 26%, rgba(255, 240, 240, 1) 100%)'
          }}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            {/* Header with close button */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">AMBITIOUS</h1>
                  <p className="text-xs text-gray-500">CAPITAL LIMITED</p>
                </div>
              </div>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const hasSubmenu = 'submenu' in item && item.submenu;
                      const isExpanded = hasSubmenu && isSubmenuExpanded(item.name);
                      
                      if (hasSubmenu) {
                        return (
                          <li key={item.name}>
                            {/* Parent menu item with submenu */}
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-green-700 hover:bg-green-50"
                            >
                              <Icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
                              {item.name}
                              {isExpanded ? (
                                <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            
                            {/* Submenu items */}
                            {isExpanded && item.submenu && (
                              <ul className="mt-1 pl-6 space-y-1">
                                {item.submenu.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isActive = location.pathname === subItem.href;
                                  
                                  return (
                                    <li key={subItem.name}>
                                      <NavLink
                                        to={subItem.href}
                                        onClick={onClose}
                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors ${
                                          isActive
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                                        }`}
                                      >
                                        <SubIcon
                                          className={`h-4 w-4 shrink-0 ${
                                            isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                                          }`}
                                        />
                                        {subItem.name}
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      } else {
                        // Regular menu item without submenu
                        const isActive = location.pathname === item.href;
                        
                        return (
                          <li key={item.name}>
                            <NavLink
                              to={item.href!}
                              onClick={onClose}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                                isActive
                                  ? 'bg-green-50 text-green-700'
                                  : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 shrink-0 ${
                                  isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                                }`}
                              />
                              {item.name}
                            </NavLink>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </li>

                {/* Logout button */}
                <li className="mt-auto">
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                    Sign out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
