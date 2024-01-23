import React, { createContext, useContext } from 'react';

const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children, baseUrl }) => (
  <BaseUrlContext.Provider value={baseUrl}>
    {children}
  </BaseUrlContext.Provider>
);

export const useBaseUrl = () => useContext(BaseUrlContext);