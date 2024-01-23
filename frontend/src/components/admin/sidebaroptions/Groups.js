import { useState } from "react";

import { useBaseUrl } from "../../../utils/providers/urlprovider";
import { useActiveClassroom } from "../../../utils/providers/ActiveClassroomContext";

import { setNewActiveClassroom, getActiveClassroom } from "../../../services/admin/classroom";


import { SidebarOption } from "../SidebarAdmin";
import AddNewClassroom from "./AddNewClassroom";

const Groups = ({goBack, classrooms, handleDeleteClassroom}) => {
    const {activeClassroom, setActiveClassroom } = useActiveClassroom();
    const [ allClassrooms, setAllClassrooms ] = useState(classrooms);

    const handleDelete = (classroom_name) => {
        handleDeleteClassroom(classroom_name);
        const newClassrooms = allClassrooms.filter((s) => s.classroom_name !== classroom_name);
        setAllClassrooms(newClassrooms);
    }

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem('token');
    const username = window.localStorage.getItem('username');

    const isActive = (classroom_name) => {
        if (classroom_name === activeClassroom.classroom_name) {
            return true;
        } else {
            return false;
        }
    }

    const pushNew = (newGroup) => {
        allClassrooms.push(newGroup);
    }

    const handleClassroomClick = async (classroomName) => {
        try {
          await setNewActiveClassroom(baseURL, token, username, classroomName);
          const fetchedActiveClassroom = await getActiveClassroom(baseURL, token, username);
          await setActiveClassroom(fetchedActiveClassroom);
        } catch (error) {
            console.error('Error updating active classroom:', error);
        }
    };

    const customSort = (a, b) => {
        if (a.classroom_name === activeClassroom.classroom_name) return -1;
        if (b.classroom_name === activeClassroom.classroom_name) return 1;
        return b.date_created.localeCompare(a.date_created);
      }; 
    
      const sortedClassrooms = [...allClassrooms].sort(customSort);

    return (
        <div className="full-container">
            <div className="flex-just-center-column padding-top first-options2">
                {allClassrooms !== null && sortedClassrooms.map((classroom) => (
                    <div key={classroom.classroom_name} className={`sidebar-option-button flex-inline primary-color flex-center ${isActive(classroom.classroom_name) ? 'make-green' : null}`}>
                        <p className="name-container change-classroom" onClick={() => handleClassroomClick(classroom.classroom_name)}>{classroom.classroom_name}</p>
                        <button className="delete-button flex-center" onClick={() => handleDelete(classroom.classroom_name)}>
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                ))}
            </div>
            <div className="second-options2 flex-center-column">
                <AddNewClassroom setActiveClassroom={setActiveClassroom} pushNew={pushNew} usePushNew={true}/>
                <SidebarOption text={"Back"} handleAction={goBack}/>
            </div>
        </div>
    )
}

export default Groups;