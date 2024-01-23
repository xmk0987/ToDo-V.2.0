import axios from 'axios';
import { CustomError } from '../../utils/errors';

const login = async (loginName, password, BASE_URL) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { loginName, password }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new CustomError("log in failed");
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
    console.error(error);

    throw new CustomError(`${error.response.data.message}`);
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
    if (error.response.data.message) {
      throw new CustomError(`${error.response.data.message}`);

    } else {
      throw new CustomError(`${error}`);

    }
  }
};

const deleteUser = async (baseURL, token, username) => {
  try {
    const response = await axios.delete(`${baseURL}/deleteuser?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new CustomError(`HTTP error! Status: ${response.status}`);
    }

    return;

  } catch (err) {
    throw new CustomError(`${err.message}`);
  }
};


export { deleteUser, signup, login };