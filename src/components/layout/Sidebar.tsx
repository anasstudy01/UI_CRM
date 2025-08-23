import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/nav-logo.png"; // Adjust the path as necessary
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  FileText,
  ArrowRightLeft,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  User,
  // Plus,
  Settings as ManageIcon,
} from "lucide-react";
import type { NavigationItem, SidebarProps } from "../../types";

/**
 * Main sidebar navigation component
 * Displays navigation menu and company branding
 */
const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  // State to manage expanded submenus
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Navigation items
  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Accounts",
      icon: TrendingUp,
      submenu: [
        {
          name: "My Accounts",
          href: "/dashboard/my-accounts",
          icon: ManageIcon,
        },
        {
          name: "Manage Accounts",
          href: "/dashboard/manage-accounts",
          icon: ManageIcon,
        },
        // {
        //   name: "Live Accounts",
        //   href: "/dashboard/live-accounts",
        //   icon: TrendingUp,
        // },
        // { name: 'Trading Account', href: '/dashboard/trading-account', icon: CreditCard },
      ],
    },
    { name: "KYC Verification", href: "/dashboard/kyc", icon: FileText },
    { name: "Deposits", href: "/dashboard/deposits", icon: CreditCard },
    {
      name: "Internal Transfer",
      href: "/dashboard/internal-transfer",
      icon: ArrowRightLeft,
    },
    { name: "IB Request", href: "/dashboard/ib-request", icon: Users },
    { name: "2FA Settings", href: "/dashboard/2fa", icon: Shield },
    { name: "Support", href: "/dashboard/support", icon: MessageCircle },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const toggleSubmenu = (menuName: string) => {
    const lowerMenuName = menuName.toLowerCase();
    setExpandedMenus((prev) =>
      prev.includes(lowerMenuName)
        ? prev.filter((name) => name !== lowerMenuName)
        : [...prev, lowerMenuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName.toLowerCase());
  };

  return (
    <div
      className="flex grow flex-col  bg-gradient-to-t from-green-500 to-white gap-y-5 overflow-y-auto px-6 pb-4 shadow-sm"
        >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <img
          src={logo}
          alt="Billion InfoTech"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = "submenu" in item && item.submenu;
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

                            return (
                              <li key={subItem.name}>
                                <NavLink
                                  to={subItem.href}
                                  className={({ isActive }) =>
                                    `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors ${
                                      isActive
                                        ? "bg-green-50 text-green-700"
                                        : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                                    }`
                                  }
                                >
                                  {({ isActive }) => (
                                    <>
                                      <SubIcon
                                        className={`h-4 w-4 shrink-0 ${
                                          isActive
                                            ? "text-green-700"
                                            : "text-gray-400 group-hover:text-green-700"
                                        }`}
                                      />
                                      {subItem.name}
                                    </>
                                  )}
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
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href!}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-5 w-5 shrink-0 ${
                                isActive
                                  ? "text-green-700"
                                  : "text-gray-400 group-hover:text-green-700"
                              }`}
                            />
                            {item.name}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                }
              })}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <a
                  href="#"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-green-700 hover:bg-green-50"
                >
                  <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
                  Settings
                </a>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                  Sign out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
