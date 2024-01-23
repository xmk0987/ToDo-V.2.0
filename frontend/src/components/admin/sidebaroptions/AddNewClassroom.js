import React, { useState }  from "react";

import { useBaseUrl } from "../../../utils/providers/urlprovider";
import { createNewClassroom, getActiveClassroom } from "../../../services/admin/classroom";
import { useActiveClassroom } from "../../../utils/providers/ActiveClassroomContext";

import Message from "../../Message";
import { SidebarOption } from "../SidebarAdmin";
import { useNavigate } from "react-router-dom";

const AddNewClassroom = ({pushNew, usePushNew}) => {
    const { setActiveClassroom } = useActiveClassroom();

    const [classroomTitle, setClassroomTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");
    const username = window.localStorage.getItem("username");
    const navigate = useNavigate();

    const createClassroom = async () => {
        if (classroomTitle.trim() !== "") {
            try {
                await createNewClassroom(baseURL, token, username, classroomTitle);
                const data = await getActiveClassroom(baseURL, token, username);
                setActiveClassroom(data);
                if (usePushNew) {
                    pushNew(data);
                }
                setClassroomTitle("");
                navigate("/adminHome");
            } catch(err){
                setIsError(true);
                setMessage("This classroom name is already in use by someone");
                setTimeout(() => {
                    setMessage("");
                    setIsError(false);
                }, 3000);  
            } 
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          createClassroom();
        }
    }

    const clearMessage = () => {
        setIsError(false);
        setMessage("");
    };

    return (
        <div className="flex-center-column">
            <Message message={message} isError={isError} clearMessage={clearMessage}/>
            <input
                value={classroomTitle} 
                placeholder="Create Group"
                className="sidebar-input"
                onChange={(e) => setClassroomTitle(e.target.value)}
                onKeyDown={handleKeyDown}
            ></input>
            <SidebarOption text={"Create"} handleAction={createClassroom} color="secondary-color"/>
        </div>
    );

}


export default AddNewClassroom;