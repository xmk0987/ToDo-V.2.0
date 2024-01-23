import React, { useCallback, useEffect, useState } from "react";

import { useActiveClassroom } from "../../utils/providers/ActiveClassroomContext";
import { useShareContext } from "../../utils/providers/ShareContext";
import { useBaseUrl } from "../../utils/providers/urlprovider";

import { getClasses } from "../../services/admin/class";
import { formattedDate } from "../../utils/helperFunctions";
import TodoCard from "../todo/TodoCard";

const Todoview = ({rowSize, widthSize, search}) => {
    const { activeClassroom } = useActiveClassroom();
    const {activeShareClass} = useShareContext();
    const [ classes, setClasses ] = useState([]);

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");

    const getAllClasses = useCallback(async () => {
        try {
            const result = await getClasses(baseURL, token, activeClassroom.classroom_name);
            setClasses(result);
          } catch (error) {
            console.error('Error fetching active classroom:', error);
        }
    }, [baseURL, token, activeClassroom]);

    useEffect(() => {
        const fetchClasses = () => {
            getAllClasses()
        };
    
        fetchClasses();

        document.addEventListener("classCreated", fetchClasses);

        return () => {
            document.removeEventListener("classCreated", fetchClasses);
        };

    }, [activeClassroom, baseURL, setClasses, token, getAllClasses, activeShareClass]); 


    const newList = classes.filter((classItem) => {
        return classItem.name.toLowerCase().includes(search) || formattedDate(classItem.date_created).includes(search);
    });
    

    return (
        <div className={`todo-view-container ${rowSize} ${widthSize}`}>
            {newList.map((classItem) => (
                <div key={classItem.class_id} className="full-container">
                    <TodoCard cardItem={classItem} getAllClasses={getAllClasses} widthSize={widthSize}/>
                </div>
            ))}
        </div>
    );
}

export default Todoview;