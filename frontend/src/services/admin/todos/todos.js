import axios from 'axios';
import { CustomError } from '../../../utils/errors';

const getTodos = async (baseURL, token, class_id) => {
  try {
    const response = await axios.get(`${baseURL}/gettodos`, {
      params: {
        class_id: class_id,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`${data.message}`, response.status);
    }

    return data.todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new CustomError(`Getting todos failed: ${error.message}`);
  }
};

const updateTodo = async (baseURL, token, todo_id, updates) => {
  try {
    const response = await axios.put(`${baseURL}/updatetodo`, {
      todo_id: todo_id,
      updates: updates,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
    return data.todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new CustomError(`Getting todos failed: ${error.message}`);
  }
};

const updateTodoFlag = async (baseURL, token, todo_id, flagged) => {
  try {
    const updates = { flagged: flagged };
    return await updateTodo(baseURL, token, todo_id, updates);
  } catch (err) {
    console.error('Error updating todo flag:', err);
    throw new CustomError(`Updating todo flag failed: ${err.message}`);
  }
};

const updateTodoComplete = async (baseURL, token, todo_id, completed) => {
  try {
    const updates = { completed: completed };
    return await updateTodo(baseURL, token, todo_id, updates);
  } catch (err) {
    console.error('Error updating todo completion status:', err);
    throw new CustomError(`Updating todo completion status failed: ${err.message}`);
  }
};

const updateTodoContent = async (baseURL, token, todo_id, content) => {
  try {
    const updates = { content: content };
    return await updateTodo(baseURL, token, todo_id, updates);
  } catch (err) {
    console.error('Error updating todo content:', err);
    throw new CustomError(`Updating todo content status failed: ${err.message}`);
  }
};

const deleteTodo = async (baseURL, token, todo_id) => {
  try {
    const response = await axios.delete(`${baseURL}/deletetodo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        todo_id: todo_id,
      },
    });

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new CustomError(`Deleting todo failed: ${error.message}`);
  }
};

const addTodo = async (baseURL, token, class_id, content) => {
  try {
    const response = await axios.post(`${baseURL}/addtodo`, {
      class_id: class_id,
      content: content,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (error) {
    console.error('Error adding todo: ', error);
    throw new CustomError(`Adding todo failed: ${error.message}`)
  }
}

const updatePosition = async (baseURL, token, todo, todo2) => {
  console.log("lähtee");
  try {
    const response = await axios.put(`${baseURL}/swapposition`, {
      todo: todo,
      todo2: todo2,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.status === 201) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (error) {
    console.error('Error swapping todo: ', error);
    throw new CustomError(`Swapping todo failed: ${error.message}`)
  }
}

export { getTodos, updateTodo, updateTodoComplete, 
        updateTodoFlag, updateTodoContent, deleteTodo, 
        addTodo, updatePosition};