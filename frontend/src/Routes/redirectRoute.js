import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "../utils/providers/ActiveRouteContext";

import isAuthenticated from "../utils/authentication/adminauth";
import isStudentAuthenticated from "../utils/authentication/studentAuthentication";

const ReDirectRoute = () => {
  const { activeRoute } = useActiveRoute();

  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = window.localStorage.getItem("admin");

    const handleRedirect = async () => {
      if (adminStatus === "true" && isAuthenticated() && activeRoute === "adminHome") {
        navigate("/adminHome");
      } else if (adminStatus === "false" && isStudentAuthenticated() && activeRoute === "studentHome") {
        navigate("/studentHome");
      } 
    };

    handleRedirect();

  }, [navigate, activeRoute]);

  return (
    <div>
      <p className="header">Loading</p>
    </div>
  );
};

export default ReDirectRoute;