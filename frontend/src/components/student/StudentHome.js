import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";


import { useBaseUrl } from "../../utils/providers/urlprovider";
import { getSharedClass, getClass } from "../../services/admin/class";
import StudentTodo from "./todo/StudentTodo";

import isStudentAuthenticated from '../../utils/authentication/studentAuthentication';
import { studentLogout } from "../../utils/authentication/logout";

const StudentHome = () => {
    const [sharedGroup, setSharedGroup] = useState(null);

    const token = window.localStorage.getItem("token");
    const classroom_name = window.localStorage.getItem("classroom_name");
    const baseUrl = useBaseUrl();
    const navigate = useNavigate();

    
    useEffect(() => {
        if(!isStudentAuthenticated()) {
            studentLogout();
            navigate("/");
        } 
        const fetchTodoList = async () => {
            try {
                const shared_class_id = await getSharedClass(baseUrl, token, classroom_name);
                if(shared_class_id !== null) {
                    const shared_class = await getClass(baseUrl, token, shared_class_id);
                    setSharedGroup(shared_class);
                }
            } catch(err){
                console.error(err);
            }
        }

        fetchTodoList();
        //eslint-disable-next-line
    }, [navigate, token, baseUrl, classroom_name]);


    const handleStudentLogout = () => {
        studentLogout();
        navigate("/");
    }

    const refresh = () => {
        window.location.reload();
    }


    return (
        <div className="full-container flex-center relative">
            {sharedGroup !== null ? 
                <StudentTodo sharedGroup={sharedGroup}/> 
            :
            <p className="header">Nothing toDo</p>
            }
            <button className="student-logout" onClick={handleStudentLogout}><ion-icon name="log-out-outline"></ion-icon></button>
            <button className="student-logout refresh-loc" onClick={refresh}><ion-icon name="refresh-outline"></ion-icon></button>
        </div>

    );

}

export default StudentHome;