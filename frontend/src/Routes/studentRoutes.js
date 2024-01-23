import React from "react";
import { Routes, Route } from "react-router-dom";

import ReDirectRoute from "./redirectRoute";
import StudentHome from "../components/student/StudentHome";

const StudentRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<ReDirectRoute />} />
            <Route path="/studentHome" element={<StudentHome /> } />
        </Routes>
    );
}

export default StudentRoutes;