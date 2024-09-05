import React from 'react';

const Alert = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    {children}
  </div>
);

const AlertTitle = ({ children }) => (
  <strong className="font-bold">{children}</strong>
);

const AlertDescription = ({ children }) => (
  <span className="block sm:inline">{children}</span>
);

export { Alert, AlertTitle, AlertDescription };