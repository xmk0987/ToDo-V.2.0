import { useState, useCallback, useEffect } from "react";
import { useBaseUrl } from "../../utils/providers/urlprovider";

import { getStudentTodos } from "../../services/student/student";

import SingleTodoProgress from "./SingleStudProgTodo";

const StudentProgressCard = ({student, sharedClass, widthSize}) => {
    const [todos, setTodos] = useState([]);    

    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");

    const getAllTodos = useCallback(async () => {
        try {
          const result = await getStudentTodos(baseURL, token, sharedClass.class_id, student.username);
          setTodos(result);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      }, [baseURL, token, sharedClass.class_id, student.username]);
    

    useEffect(() => {
        const fetchClasses = async () => {
            await getAllTodos();
        };

        fetchClasses();
        const updateEventListener = () => {
            getAllTodos();
        };
      
        window.addEventListener("updateEvent", updateEventListener);
        return () => {
            window.removeEventListener("updateEvent", updateEventListener);
        };
    }, [getAllTodos]);

    

    const sortedTodos = [...todos].sort((a, b) => a.position - b.position);

    const areAllTodosCompleted = () => {
        return todos.every(todo => todo.completed);
    }

    const checkForEmpty = () => {
        if (todos.length === 0) {
            return true;
        } else  {
            return false;
        }
    }

    return (
        <div className={`todo-card full-container ${checkForEmpty() ? ('secondary-color') : areAllTodosCompleted() ? 'make-green' : 'make-red'}`}>
            <div className="card-header">
                <h2 className="second-header">{student.username}</h2>
            </div>
            <div className={`${widthSize === 'smallestCol' ? 'card-body-numbers' : 'card-body'} scroll`}>
                {todos && sortedTodos.map((todo) => (
                     <SingleTodoProgress key={todo.student_todo_id} todo={todo} widthSize={widthSize}/>
                ))}
            </div>
            <div className="card-options">
                <p className="second-header flex-center">
                    {checkForEmpty() ? ('Nothing ToDo') : areAllTodosCompleted() ? 'Done' : 'Not done'}
                </p>
            </div>

        </div>
    );

}

export default StudentProgressCard;