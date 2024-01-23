import React, { useState} from "react";
import { addTodo } from "../../services/admin/todos/todos";

const AddTodoView = ({ baseUrl, token, class_id, onUpdate, addView}) => {
    const [todoContent, setTodoContent] = useState("");

    const handleAddClick = async () => {
        if(todoContent.trim() !== ""){
            await addTodo(baseUrl, token, class_id, todoContent);
            onUpdate();
            setTodoContent("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddClick();
        }
    };
  
    return (
      <div className="full-container add-todo-container">
        <input
          type="text"
          className="add-todo-input"
          value={todoContent}
          onChange={(e) => setTodoContent(e.target.value)}
          placeholder="ToDo?"
          onKeyDown={handleKeyDown}
        />
        <div className="add-todo-buttons full-container">
            <button
            onClick={handleAddClick}
            className="add-todo-button"
            >
            <ion-icon name="add-outline"></ion-icon>
            </button>
            <button
            onClick={addView}
            className="add-todo-button"
            >
            <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
        </div>
      </div>
    );
  };


  export default AddTodoView;