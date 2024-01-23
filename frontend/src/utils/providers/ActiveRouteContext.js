import { createContext, useContext, useState } from "react";

const ActiveRouteContext = createContext();

export const ActiveRouteProvider = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState("");

  return (
    <ActiveRouteContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </ActiveRouteContext.Provider>
  );
};

export const useActiveRoute = () => {
  const context = useContext(ActiveRouteContext);
  if (!context) {
    throw new Error("useActiveRoute must be used within an ActiveRouteProvider");
  }
  return context;
};