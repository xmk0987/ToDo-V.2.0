

export const logout = () => {
    const keysToRemove = ["token", "username", "userId", "admin", "showSharedView"];
    keysToRemove.forEach(key => window.localStorage.removeItem(key));
};

export const studentLogout = () => {
    const keysToRemove = ["token", "username", "classroom_name", "admin"];
    keysToRemove.forEach(key => window.localStorage.removeItem(key));
};