import { createContext, useContext, useState } from 'react';

const ExecutiveContext = createContext();

export const ExecutiveProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ExecutiveContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </ExecutiveContext.Provider>
  );
};

export const useExecutive = () => {
  const context = useContext(ExecutiveContext);
  if (!context) {
    throw new Error('useExecutive must be used within an ExecutiveProvider');
  }
  return context;
};
