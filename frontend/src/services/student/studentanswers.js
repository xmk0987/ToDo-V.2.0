import axios from 'axios';
import { CustomError } from '../../utils/errors';

const getStudentAnswer = async (baseURL, todo_id, username) => {
  try {
    const response = await axios.get(`${baseURL}/getstudentanswer`, {
      params: {
        todo_id,
        username,
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return data;

  } catch (err) {
    console.error('Error fetching student answers:', err);
    throw new CustomError(`Getting student answers failed: ${err.message}`);
  }
};

const addStudentAnswer = async (baseURL, token, todo_id, answer, username) => {
  try {
    const response = await axios.post(`${baseURL}/addstudentanswer`, {
      todo_id,
      answer,
      username,
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
    console.error('Error adding student answers:', err);
    throw new CustomError(`Adding student answers failed: ${err.message}`);
  }
};

const updateStudentAnswer = async (baseURL, token, todo_id, answer, username) => {
  try {
    const response = await axios.put(`${baseURL}/updatestudentanswer`, {
      todo_id,
      answer,
      username,
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
    console.error('Error updating student answers:', err);
    throw new CustomError(`Updating student answers failed: ${err.message}`);
  }
};

const deleteStudentAnswer = async (baseURL, token, todo_id, username) => {
  try {
    const response = await axios.delete(`${baseURL}/deletestudentanswer`, {
      params: {
        todo_id,
        username,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (err) {
    console.error('Error deleting student answers:', err);
    throw new CustomError(`Deleting student answers failed: ${err.message}`);
  }
};

const handleStudentAnswer = async (baseURL, token, todo_id, username, answer = null) => {
  if (answer === '') {
    return await deleteStudentAnswer(baseURL, token, todo_id, username);
  }
  const oldAnswer = await getStudentAnswer(baseURL, todo_id, username);
  if (oldAnswer.length === 0 && answer.trim().length > 0) {
    return await addStudentAnswer(baseURL, token, todo_id, answer, username);
  } else if (oldAnswer.length !== 0 && answer.trim().length > 0) {
    return await updateStudentAnswer(baseURL, token, todo_id, answer, username);
  } else {
    return;
  }
};

export { getStudentAnswer, handleStudentAnswer };