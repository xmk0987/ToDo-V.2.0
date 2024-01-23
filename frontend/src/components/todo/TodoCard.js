import React, { useState, useCallback, useEffect, useRef } from "react";

import { useBaseUrl } from "../../utils/providers/urlprovider";

import { getTodos, updatePosition } from "../../services/admin/todos/todos";
import { formattedDate } from "../../utils/helperFunctions";

import TodoCardOptions from "../../services/admin/todos/TodoOptions";
import AddTodoView from "./AddTodoView";
import SingleTodo from "./SingleTodo";

const TodoCard = ({ cardItem, getAllClasses, shareView = false, widthSize }) => {
  const [todos, setTodos] = useState([]);
  const [addingTodo, setAddingTodo] = useState(false);
  const [dragOverItem, setDragOverItem] = useState(null);

  const changeAddingStatus = () => {
    setAddingTodo(!addingTodo);
  };

  const baseURL = useBaseUrl();
  const token = window.localStorage.getItem("token");

  const getAllTodos = useCallback(async () => {
    try {
      const result = await getTodos(baseURL, token, cardItem.class_id);
      setTodos(result);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  },[baseURL, token, cardItem.class_id]);

  const firstTodo = useRef(null);
  const secondTodo = useRef(null);

  const sortedTodos = [...todos].sort((a, b) => a.position - b.position);

  const handleDragEnd = async () => {
      const todo1 = sortedTodos[firstTodo.current];
      const todo2 = sortedTodos[secondTodo.current];

      await updatePosition(baseURL, token, todo1, todo2);

      const updateEvent = new CustomEvent("updateEvent", { detail: { source: "TodoCard" } });
      window.dispatchEvent(updateEvent);

      getAllTodos();

      firstTodo.current = null;
      secondTodo.current = null;
      setDragOverItem(null); 
  };

  useEffect(() => {
    getAllTodos();
  }, [cardItem.class_id, getAllTodos]);


  
  return (
    <div className="full-container todo-card">
      <div className="card-header">
        <h2 className="second-header scroll">{cardItem.name}</h2>
        <p>{formattedDate(cardItem.date_created)}</p>
      </div>
      <div className="card-body scroll">
        {todos &&
          sortedTodos.map((todo, index) => (
              <div
                  key={todo.todo_id}
                  className={`draggable ${dragOverItem === todo ? "drag-over" : ""}`}
                  draggable="true"
                  onDragStart={() => (firstTodo.current = index)}
                  onDragEnter={() => (secondTodo.current = index)}
                  onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverItem(todo);
                  }}
                  onDragLeave={() => setDragOverItem(null)}
                  onDragEnd={handleDragEnd}
              >
                  <SingleTodo todo={todo} onUpdate={getAllTodos} widthSize={widthSize}/>
              </div>
          ))}
      </div>
      {!shareView ? (
        <div className="card-buttons">
          {addingTodo ? (
            <AddTodoView baseUrl={baseURL} token={token} class_id={cardItem.class_id} addView={changeAddingStatus} onUpdate={getAllTodos} />
          ) : (
            <TodoCardOptions baseUrl={baseURL} token={token} class_id={cardItem.class_id} addView={changeAddingStatus} getAllClasses={getAllClasses} />
          )}
        </div>
      ) : (
        <div className="card-options">
          <p className="third-header flex-center">Admin</p>
        </div>
      )}
    </div>
  );
};



export default TodoCard;