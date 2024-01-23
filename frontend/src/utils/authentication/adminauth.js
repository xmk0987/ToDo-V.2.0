import { logout } from "./logout";

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const decodedToken = decodeToken(token);
  
        const isTokenValid = decodedToken.exp * 1000 > Date.now();

        if (decodedToken.admin !== true) {
          return false;
        }
        
        if(!window.localStorage.username || !window.localStorage.userId) {
          return false;
        }

        return isTokenValid;
      } catch (error) {
        logout();
        return false;
      }
    }
    logout(); 
    return false;
  };
  
const decodeToken = (token) => {
    return JSON.parse(atob(token.split('.')[1]));
};

export default isAuthenticated;