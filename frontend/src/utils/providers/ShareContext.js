import { useCallback } from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSharedClass } from '../../services/admin/class';
import { useActiveClassroom } from './ActiveClassroomContext';
import { useBaseUrl } from './urlprovider';
import isAuthenticated from '../authentication/adminauth';

const ShareContext = createContext();

export const ShareProvider = ({ children }) => {
  const [activeShareClass, setActiveShareClass] = useState(null);
  const { activeClassroom } = useActiveClassroom();

  const baseURL = useBaseUrl();
  const token = window.localStorage.getItem("token");
  const isAdmin = window.localStorage.getItem("admin");

  const setShareClass = useCallback(
    async () => {
      if (activeClassroom.classroom_name !== undefined && isAuthenticated() && isAdmin) {
        try {
          const newClassId = await getSharedClass(baseURL, token, activeClassroom.classroom_name);
          setActiveShareClass(newClassId);
        } catch (error) {
          console.error('Error fetching shared class:', error);
        }
      }
    },
    [activeClassroom, baseURL, token, isAdmin] 
  );

  useEffect(() => {
    setShareClass();
  }, [activeClassroom, baseURL, token, setShareClass]);

  return (
    <ShareContext.Provider value={{ activeShareClass, setShareClass }}>
      {children}
    </ShareContext.Provider>
  );
};

export const useShareContext = () => {
  return useContext(ShareContext);
};