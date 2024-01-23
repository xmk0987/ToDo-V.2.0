import { useEffect, useState, useCallback } from "react";

import { updateTodoComplete } from "../../../services/student/student";
import { getStudentAnswer, handleStudentAnswer } from "../../../services/student/studentanswers";
import { getAnswer } from "../../../services/admin/answers";
import { makeLinksClickable } from "../../../utils/helperFunctions";

const SingleStudentTodo = ({ todo, onUpdate, baseUrl, token, cheeringFunction }) => {
    const [answer, setAnswer] = useState(null);
    const [studentAnswer, setStudentAnswer] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);
  
    const username = window.localStorage.getItem("username");
  
    const updateComplete = useCallback(async (completed) => {
      try {
        await updateTodoComplete(baseUrl, token, todo.student_todo_id, completed);
        onUpdate();
        if (completed) {
          cheeringFunction();
        }
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }, [baseUrl, token, todo.student_todo_id, onUpdate, cheeringFunction]);
  
    const checkAnswer = useCallback((student=studentAnswer, correct=answer) => {
      if (student !== null && student && correct && correct.length !== null) {
        
        const isCorrect = correct.toLowerCase().trim() === student.toLowerCase().trim();
        updateComplete(isCorrect);
        if (!isCorrect) {
          cheeringFunction(true);
        }
        onUpdate();
      }
    }, [answer, studentAnswer, updateComplete, onUpdate, cheeringFunction]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const oldStudentAnswer = await getStudentAnswer(baseUrl, todo.todo_id, username);
          const correctAnswer = await getAnswer(baseUrl, todo.todo_id);
  
          if(correctAnswer.answer) {
            setAnswer(correctAnswer.answer);
            if(oldStudentAnswer.student_answer) {
              setStudentAnswer(oldStudentAnswer.student_answer);
            }
          }
  
          checkAnswer(oldStudentAnswer.student_answer, correctAnswer.answer);
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    //eslint-disable-next-line
    }, [baseUrl, todo.todo_id, username, token]);
  
    useEffect(() => {
      if (answer !== null && isAnswering) {
        checkAnswer();
      }
      //eslint-disable-next-line
    }, [answer]);
  
    const handleAnswerUpdate = async () => {
      try {
        await handleStudentAnswer(baseUrl, token, todo.todo_id, username, studentAnswer);
        setIsAnswering(false);
        checkAnswer();
      } catch (error) {
        console.error('Error handling student answer:', error);
      }
    };
  
    const handleQuestion = () => {
      setIsAnswering(true);
    };

    return (
        <div className={`single-todo-container ${todo.completed ? 'make-green' : 'make-red'} student-todo`}
        onClick={() => answer ? handleQuestion() : updateComplete(!todo.completed)}>
            {isAnswering ? (
                <input 
                type="text"
                className="todo-input"
                value={studentAnswer ? studentAnswer : ''}
                placeholder={todo.content}
                onChange={(e) => setStudentAnswer(e.target.value)}
                onBlur={handleAnswerUpdate}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerUpdate()}
                autoFocus
                />
            ) :
            <>
                <div className={`single-todo-content full-container flex-inline scroll`}>
                    <div className={`check-mark  flex-center`} onClick={() => answer ? checkAnswer() : updateComplete(!todo.completed)}>
                        {answer ? (
                        <ion-icon name="help-circle-outline" onClick={handleQuestion}></ion-icon>
                        )  : (todo.completed ? (
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        ) : (
                        <ion-icon name="ellipse-outline"></ion-icon>
                        ))}
                    </div>
                    <div className="flex-center">
                        <p className="position">{todo.position}.</p>
                        <p className="scroll"
                        dangerouslySetInnerHTML={{ __html: makeLinksClickable(todo.content) }}
                        />
                    </div>
                </div>
            </>
            }

        </div>
    );
}


export default SingleStudentTodo;