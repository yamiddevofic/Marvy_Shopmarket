import React from 'react';

const Header = ({ userName }) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Dashboard Administrativo</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              {userName.charAt(0).toUpperCase()}
            </span>
            <span>{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;