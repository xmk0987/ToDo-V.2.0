
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShareContext } from "../../utils/providers/ShareContext";
import { useActiveClassroom } from "../../utils/providers/ActiveClassroomContext";
import { useBaseUrl } from "../../utils/providers/urlprovider";

import { getClass } from "../../services/admin/class";
import { getStudents } from "../../services/student/student";

import TodoCard from "../todo/TodoCard";
import StudentProgressCard from "../todo/StudentProgressCard";

const Groupview = ({rowSize, widthSize}) => {
    const {activeShareClass} = useShareContext();
    const {activeClassroom} = useActiveClassroom();
    const [sharedClass, setSharedClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState(null);

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");
  
    useEffect(() => {
        console.log(activeShareClass);
    })


  useEffect(() => {
    const fetchShareClass = async () => {
      try {
        if (activeShareClass) {
          const response = await getClass(baseURL, token, activeShareClass);
          setSharedClass(response);
        } else {
          setSharedClass(null);
        }
      } catch (error) {
        console.error("Error caught: ", error);
      }
    };
    fetchShareClass();
  }, [activeClassroom, activeShareClass, baseURL, token]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (activeShareClass) {
          const allStudents = await getStudents(baseURL, token, activeClassroom.classroom_name);
          setStudents(allStudents);
        } else {
          setStudents(null);
        }
      } catch (error) {
        console.error("Error caught: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();

    const updateEventListener = () => {
        fetchStudents();
    };

    window.addEventListener("studentDeleted", updateEventListener);
    return () => {
        window.removeEventListener("studentDeleted", updateEventListener);
    };
  }, [sharedClass, activeClassroom.classroom_name, activeShareClass, baseURL, token])

    return (
      <div className="full-container flex-inline">
        <div className={`todo-view-container ${rowSize} ${widthSize}`}>
            {sharedClass ? (
                <>
                    <TodoCard cardItem={sharedClass} shareView={true} widthSize={'smallestCol'}/>
                    {students && students.map((student) => (
                        <StudentProgressCard key={student.username} student={student} sharedClass={sharedClass} widthSize={widthSize}/>
                    ))}
                </>
            ) : null}
        </div>
      </div>
);
}

export default Groupview;