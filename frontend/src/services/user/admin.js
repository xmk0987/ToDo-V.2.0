import axios from 'axios';
import { CustomError } from '../../utils/errors';


const login = async (loginName, password, BASE_URL) => {
  try {
    const { data, status } = await axios.post(`${BASE_URL}/login`, { loginName, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (status !== 200) {
      const errorMessage = data.message && (Array.isArray(data.message) ? data.message[0].msg : data.message) || 'Request failed';
      throw new CustomError(errorMessage, status);
    }

    const localStorageItems = {
      token: data.token,
      userId: data.userId,
      username: data.username,
      admin: data.admin,
    };

    for (const [key, value] of Object.entries(localStorageItems)) {
      localStorage.setItem(key, value);
    }

  } catch (error) {
    throw new CustomError(`${error.message}`);
  }
};


const signup = async (username, email, password, BASE_URL) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, { username, email, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = response.data;

    if (!response.status === 200) {
      let errorMessage = 'Request failed';

      if (data.message) {
        if (Array.isArray(data.message) && data.message.length > 0) {
          errorMessage = data.message[0].msg;
        } else {
          errorMessage = data.message;
        }
      }

      throw new CustomError(errorMessage, response.status);
    }

    return data.message;

  } catch (error) {
    throw new CustomError(`${error.message}`);
  }
};


const deleteUser = async (baseURL, token, username) => {
  try {
    const response = await axios.delete(`${baseURL}/deleteuser?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (err) {
    throw new CustomError(`${err.message}`);
  }
};

export { deleteUser, signup, login };