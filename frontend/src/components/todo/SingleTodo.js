import React, { useState, useEffect } from "react";

import { updateTodoComplete, updateTodoContent, updateTodoFlag, deleteTodo } from "../../services/admin/todos/todos";
import { useBaseUrl } from "../../utils/providers/urlprovider";
import { getAnswer, handleAnswer } from "../../services/admin/answers";
import { makeLinksClickable } from "../../utils/helperFunctions";


const SingleTodo = ({todo, onUpdate, widthSize}) => {
    const [content, setContent ] = useState(todo.content);
    const [answer, setAnswer] = useState(''); 
    const [isAnswering, setIsAnswering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showOptions, setShowOptions] = useState(
        widthSize === "smallestCol" || widthSize === "smallerCol" ? true : false
      );
    
    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");

    useEffect(() => {
        setShowOptions(widthSize === "smallestCol" || widthSize === "smallerCol");
      }, [widthSize]);

    useEffect(() => {
        const fetchOldAnswers = async () => {
          try {
            const oldAnswer = await getAnswer(baseURL, todo.todo_id);
            setAnswer(oldAnswer.length !== 0 ? oldAnswer.answer : '');
            
          } catch (error) {
            console.error('Error fetching old answers:', error);
          }
        };
    
        if (isAnswering) {
          fetchOldAnswers();
        }
      }, [isAnswering, baseURL, todo.todo_id]);
  
      const handleUpdate = async (updateType) => {
          try {
              switch (updateType) {
                  case "flag":
                      await updateTodoFlag(baseURL, token, todo.todo_id, !todo.flagged);
                      break;
                  case "complete":
                      await updateTodoComplete(baseURL, token, todo.todo_id, !todo.completed);
                      break;
                  case "content":
                      await updateTodoContent(baseURL, token, todo.todo_id, content);
                      break;
                  case "delete":
                      await deleteTodo(baseURL, token, todo.todo_id);
                      break;
                  case "answer":
                      await handleAnswer(baseURL, token, todo.todo_id, answer);
                      break;
                  default:
                      break;
              }
              onUpdate();
              const updateEvent = new CustomEvent("updateEvent", { detail: { source: "TodoCard" } });
              window.dispatchEvent(updateEvent);
          } catch (error) {
              console.error('Error updating todos:', error);
          }
      }
  
    const handleEdit = () => {
        setIsEditing(true);
    };    

    const handleQuestion = () => {
        setIsAnswering(true);
    };

    const handleContentUpdate = () => {
        if (content.trim().length === 0) {
        handleUpdate("delete");
        } else {
        handleUpdate("content");
        }
        setIsEditing(false);
    };

    const handleAnswerUpdate = () => {
        handleUpdate("answer");
        setIsAnswering(false);
    };

    const toggleMenu = () => {
        setShowOptions((prevShowOptions) => !prevShowOptions);
      };

    return (
        <div className="single-todo-container relative">
            { isEditing ?
            (<input 
            className="todo-input"
            placeholder={todo.content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleContentUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleContentUpdate()}
            autoFocus
            />) :
            (
                <>
                {isAnswering ? (
                    <input 
                    className="todo-input"
                    value={answer}
                    placeholder={todo.content}
                    onChange={(e) => setAnswer(e.target.value)}
                    onBlur={handleAnswerUpdate}
                    onKeyDown={(e) => e.key === "Enter" && handleAnswerUpdate()}
                    autoFocus
                    />
                ) 
                : (
                    <>
                    <div className="single-todo-content flex-inline scroll">
                        <p className="position">{todo.position}.</p>
                        <p className="scroll" 
                        dangerouslySetInnerHTML={{
                            __html: makeLinksClickable(todo.content),
                        }}/>
                    </div>
                    {!showOptions ? 
                        <div className={`single-todo-menu flex-center`}>
                        {todo.flagged ? (
                            <button
                            className="menu-button"
                            onClick={() => handleUpdate("flag")}
                            >
                            <ion-icon name="flag"></ion-icon>
                            </button>
                        ) : (
                            <button
                            className="menu-button"
                            onClick={() => handleUpdate("flag")}
                            >
                            <ion-icon name="flag-outline"></ion-icon>
                            </button>
                        )}
                        <button onClick={handleEdit}
                            className="menu-button"
                        >
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button onClick={handleQuestion}
                            className={`menu-button`}
                        >
                            {todo.isquestion ? 
                                <ion-icon name="help-circle-outline"></ion-icon>
                                : 
                                <ion-icon name="help-outline"></ion-icon>
                            }
                        </button>
                        <button
                            className="menu-button"
                            onClick={() => handleUpdate("delete")}
                        >
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                        {widthSize === 'smallestCol' || widthSize === 'smallerCol' ? 
                            <button onClick={toggleMenu} className="menu-button"><ion-icon name="menu-outline"></ion-icon></button>
                            :
                            null
                        }

                    </div>
                    :
                    <div >
                        <button onClick={toggleMenu} className="menu-button"><ion-icon name="menu-outline"></ion-icon></button>
                    </div>

                    }
                    </>
                )}
                </>
            )}
        </div>       
    );
}


export default SingleTodo;