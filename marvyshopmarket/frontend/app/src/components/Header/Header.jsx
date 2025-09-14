import React, { useState } from 'react';
import ToggleDark from '../Toggle/ToggleTheme';
import { User, ChevronDown, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Header = ({ userName, adminInfo, storeInfo, selectedOption }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const displayName = userName || 'Usuario';
  const initial = (displayName?.charAt?.(0) || '?').toUpperCase();
  

  const handleProfileClick = () => {
    localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    localStorage.setItem('userName', userName);
    localStorage.setItem('admInitial', initial);
    localStorage.setItem('selectedOption', selectedOption);
    navigate('/perfil');
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/cerrar-sesion`);
      if (response.status === 200) {
        // Eliminar la información de sesión almacenada en localStorage
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userName');
        Cookies.remove('loggedIn');
        Cookies.remove('userName');

        // Redirigir a la página de inicio de sesión u otra página
        navigate('/');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  console.log("adminInfo en Header:", adminInfo);
  console.log("storeInfo en Header:", storeInfo);
  console.log("userName en Header:", userName);
  console.log("selectedOption en Header:", selectedOption);

  return (
    <header className="border-b w-100 dark:bg-black border-gray-200 dark:border-gray-700">
      {/* Main Header */}
      <div className="relative bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left side - Menu Button and Titles */}
          <div className="flex items-center">
            {/* Mobile Menu Button - Solo visible en móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Títulos */}
            <div className="flex items-center space-x-3">
              {/* Título móvil */}
              <div className="md:hidden ml-2">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {storeInfo?.nombre || 'Tu tienda'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard Admin
                </p>
              </div>

              {/* Título desktop */}
              <h2 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white">
                Dashboard Administrativo
              </h2>
            </div>
          </div>

          {/* Right side - User info and theme toggle */}
          <div className="flex items-center">
            {/* User Profile - Desktop */}
            <div className="hidden md:flex items-center space-x-3 mr-4">
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 text-white font-medium shadow-sm">
                    {initial}
                  </div>
                  <div className="flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>

                {/* Desktop Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-medium">{displayName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {storeInfo?.nombre || 'Tu tienda'}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={() => {handleProfileClick()}}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Perfil
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      Configuración
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile User Avatar */}
            <div className="md:hidden mr-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 text-white font-medium shadow-sm">
                {initial}
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
              <ToggleDark />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-medium">
                  {initial}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {storeInfo?.nombre || 'Tu tienda'}
                  </div>
                </div>
              </div>
            </div>
            <nav className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <span>Perfil</span>
              </button>
              <button 
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <span>Configuración</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Breadcrumb - Hidden on mobile */}
      <div className="hidden md:flex h-10 px-4 lg:px-6 bg-green-200 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 items-center">
        <nav className="text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? 'font-medium text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            <li>
              <NavLink 
              to={`/${selectedOption}`}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'font-medium text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
              >
                {selectedOption === 'login' || selectedOption === 'registrarse' || selectedOption === 'home' ? '' : selectedOption}
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default Header;
