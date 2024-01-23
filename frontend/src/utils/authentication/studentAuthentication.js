import { studentLogout } from "./logout";

const isStudentAuthenticated = async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const decodedToken = decodeToken(token);
  
        const isTokenValid = decodedToken.exp * 1000 > Date.now();

        if (decodedToken.admin !== false) {
          return false;
        }

        if(!window.localStorage.username || !window.localStorage.classroom_name) {
          return false;
        }

        return isTokenValid;
      } catch (error) {
        studentLogout();
        return false;
      }
    }
    studentLogout(); 
    return false;
  };
  
const decodeToken = (token) => {
    return JSON.parse(atob(token.split('.')[1]));
};

export default isStudentAuthenticated;