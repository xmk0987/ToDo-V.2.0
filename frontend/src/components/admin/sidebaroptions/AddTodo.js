import React, { useState }  from "react";

import { useBaseUrl } from "../../../utils/providers/urlprovider";
import { useActiveClassroom } from "../../../utils/providers/ActiveClassroomContext";
import {createClass} from '../../../services/admin/class'

import Message from "../../Message";
import { SidebarOption } from "../SidebarAdmin";


const AddTodo = ({goBack}) => {
    const {activeClassroom} = useActiveClassroom();
    const [todoTitle, setTodoTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");

    const createTodo = async () => {
        if (todoTitle.trim() !== "") {
            await createClass(baseURL, token, activeClassroom.classroom_name, todoTitle);
            setTodoTitle("");
            setMessage("Todo Created");
            const event = new Event("classCreated");
            document.dispatchEvent(event);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          createTodo();
        }
    }

    const clearMessage = () => {
        setIsError(false);
        setMessage("");
    };

    return (
        <div className="full-container">
            <div className="flex-just-center-column padding-top first-options">
                <Message message={message} isError={isError} clearMessage={clearMessage}/>
                <input
                    value={todoTitle} 
                    placeholder="Add ToDo"
                    className="sidebar-input"
                    onChange={(e) => setTodoTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                ></input>
                <SidebarOption text={"Create"} handleAction={createTodo}/>
            </div>
            <div className="second-options flex-center-column">
                <SidebarOption text={"Back"} handleAction={goBack}/>
            </div>
        </div>
    );
}

export default AddTodo;