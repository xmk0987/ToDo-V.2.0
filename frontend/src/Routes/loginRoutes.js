import React from "react";
import { Routes, Route } from "react-router-dom";

import ChooseLogin from "../components/userlogin/ChooseLogin";
import ReDirectRoute from "./redirectRoute";

const LoginRoutes = () => {

    return (
        <Routes>
            <Route path="*" element={<div>Page not found</div>}/>
            <Route path="/" element={<ReDirectRoute />} />
            <Route path="/login" element={<ChooseLogin />} />
        </Routes>
    );
}

export default LoginRoutes;