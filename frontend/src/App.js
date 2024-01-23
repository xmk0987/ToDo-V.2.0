import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BaseUrlProvider } from "./utils/providers/urlprovider";
import { useActiveRoute } from "./utils/providers/ActiveRouteContext";

import LoginRoutes from "./Routes/loginRoutes";
import AdminRoutes from "./Routes/adminRoutes";
import StudentRoutes from "./Routes/studentRoutes";

import isStudentAuthenticated from "./utils/authentication/studentAuthentication";
import isAuthenticated from "./utils/authentication/adminauth";

import './styles/Main.css';
import './styles/color.css';
import './styles/phone.css';

function App() {
  //const BASE_FETCH_URL = "http://localhost:8888";
 
  const BASE_FETCH_URL = "https://todo-6fsq.onrender.com";
  const { activeRoute, setActiveRoute } = useActiveRoute();

  const navigate = useNavigate();

  const token = window.localStorage.getItem("token");
  const adminStatus = window.localStorage.getItem("admin");

  const goToRoute = useCallback( async () => {
      navigate(`/${activeRoute}`);
  }, [navigate, activeRoute,]);

  useEffect(() => {
    if (adminStatus === "true" && isAuthenticated()) {
      setActiveRoute("adminHome");
    } else if (adminStatus === "false" && isStudentAuthenticated()) {
      setActiveRoute("studentHome");
    } else {
      setActiveRoute("login");
    }
    //eslint-disable-next-line
  }, [adminStatus, token, isAuthenticated(), isStudentAuthenticated()]);

  useEffect(() => {
    goToRoute();
    //eslint-disable-next-line
  }, [activeRoute]);

  return (
    <BaseUrlProvider baseUrl={BASE_FETCH_URL}>
        <div className="full-container ">
          {activeRoute === "adminHome" ? (
            <AdminRoutes />
          ) : activeRoute === "studentHome" ? (
            <StudentRoutes />
          ) : (
            activeRoute=== "login" ? (
              <LoginRoutes />
            ):
            null
          )}
        </div>
    </BaseUrlProvider>
  );
}

export default App;

