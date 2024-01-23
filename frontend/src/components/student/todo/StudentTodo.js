import { useEffect, useState, useCallback } from "react";

import { useBaseUrl } from "../../../utils/providers/urlprovider";
import { getStudentTodos } from "../../../services/student/student";
import { formattedDate } from "../../../utils/helperFunctions";

import '../../../styles/student/studentCard.css';
import SingleStudentTodo from "./SingleStudentTodo";


const StudentTodo = ({sharedGroup}) => {
    const [todos, setTodos] = useState([]);
    const [cheer, setCheer] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null); 

    const baseUrl = useBaseUrl();
    const token = window.localStorage.getItem("token");
    const username = window.localStorage.getItem("username");

    const fetchTodos = useCallback(async () => {
    try {
        const newTodos = await getStudentTodos(baseUrl, token, sharedGroup.class_id, username);
        setTodos(newTodos);
    } catch (err) {
        console.error(err);
    }
    }, [baseUrl, token, sharedGroup.class_id, username]);

    useEffect(() => {
        fetchTodos();
        //eslint-disable-next-line
    }, [baseUrl, sharedGroup.class_id, token, username, fetchTodos]);

    const dateNow = Date.now();

    const checkForEmpty = () => todos.length === 0;

    const getRandomCheer = () => {
      const defaultCheers = ["Hooray", "Great job", "Well done", "Fantastic", "Awesome"];
      const randomIndex = Math.floor(Math.random() * defaultCheers.length);
      return defaultCheers[randomIndex];
    };
  
    const cheeringFunction = (wrong = false) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (wrong) {
        setCheer('Answer wrong.');
      } else {
        if (getCompletedTodoCount() === 0) {
          setCheer('First one done!');
        } else if (getRemainingTodoCount() === 6) {
          setCheer('5 more to go!');
        } else if (getRemainingTodoCount() === 2) {
          setCheer('1 more left!');
        } else {
          const randomCheer = getRandomCheer();
          setCheer(randomCheer);
        }
      }
  
      const newTimeoutId = setTimeout(() => {
        setCheer(null);
      }, 3000);
  
      setTimeoutId(newTimeoutId);
    };

    const getCompletedTodoCount = () => todos.filter((todo) => todo.completed).length;

    const getRemainingTodoCount = () => todos.filter((todo) => !todo.completed).length;
  
    const areAllTodosCompleted = () => todos.every((todo) => todo.completed);
  
    const sortedTodos = [...todos].sort((a, b) => a.position - b.position);


    return (
      <div className="student-card-container flex-center-column">
        <div className={`student-card-header full-width flex-center-column ${checkForEmpty() ? 'secondary-color' : areAllTodosCompleted() ? 'make-green' : 'make-red'}`}>
            <h1 className="header scroll">{cheer === null ? sharedGroup.name : cheer}</h1>
            <p>{formattedDate(dateNow)}</p>
        </div>
        <div className="student-card-body full-width">
            {sortedTodos.map((todo) => (
                <SingleStudentTodo key={todo.student_todo_id}
                        todo={todo} 
                        onUpdate={fetchTodos}
                        baseUrl={baseUrl}
                        token={token}
                        cheeringFunction={cheeringFunction}
                />
            ))}
        </div>
      </div>
    );
}

export default StudentTodo;