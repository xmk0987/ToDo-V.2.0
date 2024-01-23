import axios from 'axios';
import { CustomError } from '../../utils/errors';

const getAnswer = async (baseURL, todo_id) => {
  try {
    const response = await axios.get(`${baseURL}/getanswer`, {
      params: {
        todo_id: todo_id,
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return data;

  } catch (error) {
    console.error('Error fetching answers:', error);
    throw new CustomError(`Getting answers failed: ${error.message}`);
  }
};

const addAnswer = async (baseURL, token, todo_id, answer) => {
  try {
    const response = await axios.post(`${baseURL}/addanswer`, {
      todo_id: todo_id,
      answer: answer,
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
    console.error('Error adding answers:', error);
    throw new CustomError(`Adding answers failed: ${error.message}`);
  }
};

const updateAnswer = async (baseURL, token, todo_id, answer) => {
  try {
    const response = await axios.put(`${baseURL}/updateanswer`, {
      todo_id: todo_id,
      answer: answer,
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
    console.error('Error updating answers:', error);
    throw new CustomError(`Updating answers failed: ${error.message}`);
  }
};

const deleteAnswer = async (baseURL, token, todo_id) => {
  console.log("pitäisi poistaa");
  try {
    const response = await axios.delete(`${baseURL}/deleteanswer`, {
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
    console.error('Error deleting answers:', error);
    throw new CustomError(`Deleting answers failed: ${error.message}`);
  }
};

const handleAnswer = async (baseURL, token, todo_id, answer) => {
  const oldAnswer = await getAnswer(baseURL, todo_id);
  if (oldAnswer.length === 0 && answer.trim().length > 0) {
    return await addAnswer(baseURL, token, todo_id, answer);
  } else if (oldAnswer.length !== 0 && answer.trim().length > 0) {
    return await updateAnswer(baseURL, token, todo_id, answer);
  } else if (oldAnswer.length === 0 && answer.trim().length === 0) {
    return;
  } else {
    return await deleteAnswer(baseURL, token, todo_id);
  }
};

export { getAnswer, handleAnswer };