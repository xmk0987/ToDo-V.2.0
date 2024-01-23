import axios from 'axios';
import { CustomError } from "../../utils/errors";


const getClasses = async (baseURL, token, classroom_name) => {
  try {
      const response = await fetch(`${baseURL}/findclasses?classroom_name=${classroom_name}`, {
          method: 'GET',
          headers: {
             'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new CustomError(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.classes;
  } catch(err) {
      console.error('Error fetching classes:', err);
      throw new CustomError(`Getting classes failed: ${err.message}`);
  }
}
  
  const deleteClass = async (baseURL, token, class_id) => {
    try {
      const response = await axios.delete(`${baseURL}/deleteclass`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          class_id: class_id,
        },
      });
  
      if (!response.status === 200) {
        throw new CustomError(`HTTP error! Status: ${response.status}`);
      }
  
      return;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw new CustomError(`Deleting class failed: ${error.message}`);
    }
  };
  
  const createClass = async (baseURL, token, classroom_name, name) => {
    try {
      const response = await axios.post(`${baseURL}/addclass`, {
        classroom_name: classroom_name,
        name: name,
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
      console.error('Error creating class:', error);
      throw new CustomError(`Creating class failed: ${error.message}`);
    }
  };
  
  const setSharedClass = async (baseURL, token, classroom_name, class_id) => {
    try {
      const response = await axios.put(`${baseURL}/setsharedclass`, {
        classroom_name: classroom_name,
        class_id: class_id,
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
      console.error('Error setting shared class:', error);
      throw new CustomError(`Setting shared class failed: ${error.message}`);
    }
  };
  
  const getSharedClass = async (baseURL, token, classroom_name) => {
    try {
      const response = await axios.get(`${baseURL}/getsharedclass`, {
        params: {
          classroom_name: classroom_name,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.status === 200) {
        throw new CustomError(`HTTP error! Status: ${response.status}`);
      }
  
      const data = response.data;
      return data.shared_id;
    } catch (error) {
      console.error('Error fetching shared class:', error);
      throw new CustomError(`Fetching shared class failed: ${error.message}`);
    }
  };
  
  const getClass = async (baseURL, token, class_id) => {
    try {
      const response = await axios.get(`${baseURL}/findclass`, {
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
  
      return data.class;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw new CustomError(`Fetching class failed: ${error.message}`);
    }
  };


export {getClasses, deleteClass, createClass, getSharedClass, setSharedClass, getClass};