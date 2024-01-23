import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getActiveClassroom } from '../../services/admin/classroom';
import { useBaseUrl } from './urlprovider';

import isAuthenticated from '../authentication/adminauth';

const ActiveClassroomContext = createContext();

export const ActiveClassroomProvider = ({ children }) => {
  const [activeClassroom, setActiveClassroom] = useState({});
  const navigate = useNavigate();

  const baseURL = useBaseUrl();
  const token = window.localStorage.getItem("token");
  const username = window.localStorage.getItem("username");
  const isAdmin = window.localStorage.getItem("admin");

  useEffect(() => {
    const fetchActiveClassroom = async () => {
      try {
        if(isAuthenticated() && isAdmin){
          const result = await getActiveClassroom(baseURL, token, username);
          if(!result) {
            navigate("/firstClassroom");
          } else {
            setActiveClassroom(result);
          }
        }
      } catch (error) {
        console.error('Error fetching active classroom:', error);
      }
    };
  
    fetchActiveClassroom();
  }, [baseURL, token, username, navigate, setActiveClassroom, isAdmin]);

  return (
    <ActiveClassroomContext.Provider value={{ activeClassroom, setActiveClassroom }}>
      {children}
    </ActiveClassroomContext.Provider>
  );
};

export const useActiveClassroom = () => {
  const context = useContext(ActiveClassroomContext);
  if (!context) {
    throw new Error('useActiveClassroom must be used within an ActiveClassroomProvider');
  }
  return context;
};