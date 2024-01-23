import React from "react";
import { Routes, Route } from "react-router-dom";

import { ActiveClassroomProvider } from "../utils/providers/ActiveClassroomContext";
import { ShareProvider } from "../utils/providers/ShareContext";

import AdminHome from "../components/admin/AdminHome";
import ReDirectRoute from "./redirectRoute";
import FirstClassroom from "../components/admin/FirstClassroom";

const AdminRoutes = () => {

    return (
        <ActiveClassroomProvider>
            <ShareProvider>
                <Routes>
                    <Route path="*" element={<div>Page not found</div>}/>
                    <Route path="/" element={<ReDirectRoute />} />
                    <Route path="/adminHome" element={<AdminHome />} />
                    <Route path="/firstClassroom" element={<FirstClassroom />}/>
                </Routes>
            </ShareProvider>
        </ActiveClassroomProvider>
    );
}

export default AdminRoutes;