import React, { useState, useEffect } from "react";

import { useActiveClassroom } from "../../../utils/providers/ActiveClassroomContext";
import { useShareContext } from "../../../utils/providers/ShareContext";
import { getSharedClass, setSharedClass, deleteClass } from "../../../services/admin/class";


const TodoCardOptions = ({ baseUrl, token, class_id, addView, getAllClasses }) =>  {
    const { activeClassroom } = useActiveClassroom();
    const {activeShareClass, setShareClass} = useShareContext();
    const [isOnShare, setIsOnShare] = useState(false);
  
    useEffect(() => {
        setIsOnShare(activeShareClass === class_id);
    }, [activeShareClass, class_id]);
  
    const handleDeleteButton = async () => {
        const shared_id = await getSharedClass(baseUrl, token, activeClassroom.classroom_name);
        if (shared_id === class_id) {
            await setSharedClass(baseUrl, token, activeClassroom.classroom_name, null);
            setIsOnShare(false); 
        }
        await deleteClass(baseUrl, token, class_id);
        getAllClasses();
    };
  
    const setOnShare = async () => {
        setIsOnShare(prevIsOnShare => {
            if (prevIsOnShare) {
                setSharedClass(baseUrl, token, activeClassroom.classroom_name, null);
                setShareClass(null);
                return false;
            } else {
                setSharedClass(baseUrl, token, activeClassroom.classroom_name, class_id);
                setShareClass(class_id);
                return true;
            }
        });
    };


    return (
        <div className="full-container flex-inline">
            <div className="todo-card-option full-container flex-center" onClick={addView}>
                <ion-icon name="add-outline"></ion-icon>
            </div>
            <div className={`todo-card-option full-container flex-center ${isOnShare ? "make-green" : null}`} 
                onClick={setOnShare}>
                <ion-icon name="desktop"></ion-icon>
            </div>
            <div className="todo-card-option full-container flex-center" onClick={handleDeleteButton}>
                <ion-icon name="trash"></ion-icon>
            </div>
        </div>
    );
}

export default TodoCardOptions;