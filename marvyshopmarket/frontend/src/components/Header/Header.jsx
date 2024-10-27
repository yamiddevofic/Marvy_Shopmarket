import React from 'react';
import ToggleDark from '../Toggle/ToggleTheme';
import { User, ChevronDown } from 'lucide-react';

const Header = ({ userName }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-800 transition-colors duration-200">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h2>
        </div>

        {/* Right side - User info and theme toggle */}
        <div className="flex items-center space-x-6">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="relative group">
              <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 text-white font-medium shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {userName}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="font-medium">{userName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Administrador
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Perfil
                </button>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Configuración
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
            <ToggleDark />
          </div>
        </div>
      </div>

      {/* Sub-header / Breadcrumb */}
      <div className="h-10 px-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <nav className="text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Inicio
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              Dashboard
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default Header;