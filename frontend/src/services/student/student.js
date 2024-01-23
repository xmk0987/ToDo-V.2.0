import axios from 'axios';
import {CustomError} from '../../utils/errors';

const studentLogin = async  (baseURL, classroom_name, username) => {
  try {
      const response = await fetch(`${baseURL}/studentlogin`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classroom_name, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new CustomError(data.message, response.status)
      }

      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("username", data.username);
      window.localStorage.setItem("classroom_name", data.classroom_name);
      window.localStorage.setItem("admin", data.admin);

      return;
      
  } 
  catch (error) {
    console.log(error);
      throw new CustomError(`${error.message}`);
  }
}


const getStudentTodos = async (baseURL, token, class_id, username) => {
  if (class_id) {
    try {
      const response = await axios.get(`${baseURL}/getstudenttodos`, {
        params: {
          username,
          class_id,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!response.status === 200) {
        throw new CustomError(`${data.message}`, response.status);
      }

      return data;

    } catch (error) {
      throw new CustomError(`${error.message}`, error.status);
    }
  } else {
    console.error("No class id");
  }
};

const updateTodoComplete = async (baseURL, token, student_todo_id, completed) => {
  try {
    const updates = { completed: completed };
    return await updateTodo(baseURL, token, student_todo_id, updates);
  } catch (err) {
    console.error('Error updating todo completion status:', err);
    throw new CustomError(`Updating todo completion status failed: ${err.message}`);
  }
};

const updateTodo = async (baseURL, token, student_todo_id, updates) => {
  try {
    const response = await axios.put(`${baseURL}/updatestudenttodo`, {
      student_todo_id: student_todo_id,
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

    return;

  } catch (err) {
    console.error('Error updating todos:', err);
    throw new CustomError(`Updating todos failed: ${err.message}`);
  }
};

const getStudents = async (baseURL, token, classroom_name) => {
  try {
    const response = await axios.get(`${baseURL}/getclassroomstudents`, {
      params: {
        classroom_name,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`${data.message}`, response.status);
    }

    return data;

  } catch (err) {
    console.error('Error getting students:', err);
    throw new CustomError(`Getting students failed: ${err.message}`);
  }
};

const deleteStudent = async (baseURL, token, username) => {
  try {
    const response = await axios.delete(`${baseURL}/deletestudent`, {
      params: {
        username: username,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`${data.message}`, response.status);
    }

    return;

  } catch (err) {
    console.error('Error deleting student:', err);
    throw new CustomError(`Deleting student failed: ${err.message}`);
  }
};

const getStudent = async (baseURL, token, username) => {
  try {
    const response = await axios.get(`${baseURL}/getstudent`, {
      params: {
        username,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`${data.message}`, response.status);
    }

    return data;

  } catch (err) {
    console.error('Error getting students:', err);
    throw new CustomError(`Getting students failed: ${err.message}`);
  }
};

const setName = async (baseURL, token, username, name) => {
  try {
    const response = await axios.put(`${baseURL}/setstudentname`, {
      username,
      name,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`${data.message}`, response.status);
    }

    return;

  } catch (err) {
    console.error('Error setting name:', err);
    throw new CustomError(`Setting name failed: ${err.message}`);
  }
};

export {
    studentLogin,
    getStudentTodos,
    updateTodoComplete,
    getStudents,
    deleteStudent,
    getStudent,
    setName
};