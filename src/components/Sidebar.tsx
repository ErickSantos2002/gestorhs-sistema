import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  if (location.pathname === '/login') return null;

  const menuItems = [
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Empresas',
      to: '/empresas',
      icon: Building2,
    },
    {
      label: 'Equipamentos',
      to: '/equipamentos',
      icon: Package,
    },
    {
      label: 'Ordens de Serviço',
      to: '/ordens',
      icon: FileText,
    },
    {
      label: 'Relatórios',
      to: '/relatorios',
      icon: BarChart3,
    },
    ...(user?.perfil === 'admin'
      ? [
          {
            label: 'Configurações',
            to: '/configuracoes',
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <aside className="hidden lg:flex w-56 bg-white dark:bg-[#0a192f] text-gray-900 dark:text-gray-100 shadow sticky top-0 h-screen flex-col transition-colors">
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-200 text-blue-700 dark:bg-white/10 dark:text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-700'
                    }`
                  }
                  end
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Switch de modo noturno */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between font-medium text-gray-800 dark:text-white">
          <div className="flex items-center gap-2">
            {darkMode ? (
              <img
                src="https://img.icons8.com/?size=100&id=s6SybfgfYCLU&format=png&color=FFD700"
                alt="Modo Claro"
                className="w-6 h-6 drop-shadow-md"
              />
            ) : (
              <img
                src="https://img.icons8.com/?size=100&id=11404&format=png&color=2563EB"
                alt="Modo Escuro"
                className="w-6 h-6 drop-shadow-md"
              />
            )}
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-gray-400 dark:bg-gray-700 rounded-full peer-checked:bg-blue-700 transition-all"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full border shadow-md transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
