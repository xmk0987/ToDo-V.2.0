import React, { useEffect, useState } from "react";
import { useBaseUrl } from "../../utils/providers/urlprovider";

import { makeLinksClickable } from "../../utils/helperFunctions";

import { getAnswer } from "../../services/admin/answers";
import {getStudentAnswer} from "../../services/student/studentanswers";

const SingleTodoProgress = ({todo, widthSize}) => {
    const [studentAnswer, setStudentAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);

    const baseURL = useBaseUrl();

    useEffect(() => {
        const fetchStudentAnswers = async () =>{
            const newStudentAnswer = await getStudentAnswer(baseURL, todo.todo_id, todo.student_username);
            if(newStudentAnswer.student_answer) {
                setStudentAnswer(newStudentAnswer.student_answer);
            }         
        }

        const fetchAnswers = async () => {
            const isAnswer = await getAnswer(baseURL, todo.todo_id);
            if (isAnswer.answer) {
                setIsAnswer(true);
            } else {
                setIsAnswer(false);
            }
        }

        fetchAnswers();
        fetchStudentAnswers();
        const updateEventListener = () => {
            fetchAnswers();
            fetchStudentAnswers();
        };

        window.addEventListener("updateEvent", updateEventListener);
        return () => {
            window.removeEventListener("updateEvent", updateEventListener);
        };
    },[baseURL, todo.student_username, todo.todo_id]);

    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    }

    return (
        <div className={`single-todo-container ${todo.completed ? 'make-green' : studentAnswer ? 'make-yellow' : 'make-red'} ${widthSize === 'smallestCol' ? 'number-border' : null}`}>
          {widthSize === 'smallestCol' ? (
            <div className="one-number flex-center full-container" id="borderless"><p>{todo.position}</p></div>
          ) : (
            <>
              {!showAnswer ? (
                <div className="single-todo-content flex-inline scroll">
                  <p className="position">{todo.position}.</p>
                  <p
                    className="scroll"
                    dangerouslySetInnerHTML={{ __html: makeLinksClickable(todo.content) }}
                  />
                </div>
              ) : (
                <p className={`todo-content student-progress-answer`}>
                  {todo.position}. {studentAnswer}
                </p>
              )}
              {isAnswer ? (
                <div className="question-mark">
                  <ion-icon name="help-circle-outline" onClick={toggleShowAnswer}></ion-icon>
                </div>
              ) : null}
            </>
          )}
        </div>
      );

}

export default SingleTodoProgress;