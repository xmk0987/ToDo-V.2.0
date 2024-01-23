import { useState } from "react";
import { SidebarOption } from "../SidebarAdmin";


const Members = ({goBack, students, handleDeleteStudent}) => {
    const [ allStudents, setAllStudents ] = useState(students);

    const handleDelete = async (username) => {
        await handleDeleteStudent(username);
        const newStudents = allStudents.filter((s) => s.username !== username);
        setAllStudents(newStudents);
        const updateEvent = new CustomEvent("studentDeleted", { detail: { source: "Members" } });
        window.dispatchEvent(updateEvent);
    }

    return (
        <div className="full-container">
            <div className="flex-just-center-column padding-top first-options">
                {allStudents !== null && allStudents.map((student) => (
                    <div key={student.username} className="sidebar-option-button flex-inline primary-color flex-center">
                        <p className="name-container">{student.name} - {student.username}</p>
                        <button className="delete-button flex-center" onClick={() => handleDelete(student.username)}>
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                ))}
            </div>
            <div className="second-options flex-center-column">
                <SidebarOption text={"Back"} handleAction={goBack}/>
            </div>
        </div>
    )
}

export default Members;