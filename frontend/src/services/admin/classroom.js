import axios from 'axios';
import { CustomError } from "../../utils/errors";

const getClassroom = async (baseURL, classroom_name) => {
    try {
      const response = await axios.get(`${baseURL}/findClassroom`, {
        params: {
          classroom_name: classroom_name,
        },
      });
  
      const data = response.data;
  
      return data.classroom;
  
    } catch (error) {
      throw new CustomError(`Getting classrooms failed: ${error.message}`);
    }
};
  

const getClassrooms = async (baseURL, token, username) => {
    try {
        const response = await axios.get(`${baseURL}/findClassrooms`, {
        params: {
            username: username,
        },
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        });

        const data = response.data;

        return data.classrooms;

    } catch (error) {
        throw new CustomError(`Getting classrooms failed: ${error.message}`);
    }
};

const getActiveClassroom = async (baseURL, token, username) => {
    try {
        const response = await axios.get(`${baseURL}/findactive`, {
        params: {
            username: username,
        },
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        });

        if (!response.status === 200) {
        throw new CustomError(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;

        return data.classroom[0];

    } catch (error) {
        throw new CustomError(`Getting active classroom failed: ${error.message}`);
    }
};
  

const setNewActiveClassroom = async (baseURL, token, username, classroom_name) => {
    try {
      const response = await axios.put(`${baseURL}/setactiveclassroom`, {
        username: username,
        classroom_name: classroom_name,
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
      throw new CustomError(`Setting new active classroom failed: ${error.message}`);
    }
};


const createNewClassroom = async (baseURL, token, username, classroom_name) => {
    try {
      const response = await axios.post(`${baseURL}/addclassroom`, {
        username: username,
        classroom_name: classroom_name,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.status === 200) {
        throw new CustomError(response.data.message, response.status);
      }
  
      return;
  
    } catch (error) {
      throw new CustomError(`${error.message}`, error.status);
    }
};


const deleteClassroom = async (baseURL, token, classroom_name) => {
    try {
      const response = await axios.delete(`${baseURL}/deleteclassroom`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          classroom_name: classroom_name,
        },
      });
  
      if (!response.status === 200) {
        throw new CustomError(`HTTP error! Status: ${response.status}`);
      }
  
      return;
  
    } catch (error) {
      throw new CustomError(`${error.message}`, error.status);
    }
};


export { getClassrooms, getActiveClassroom, setNewActiveClassroom, createNewClassroom, deleteClassroom, getClassroom};