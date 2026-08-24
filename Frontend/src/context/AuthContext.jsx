import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const login = (employeeData, userToken, userRole) => {
    setEmployee(employeeData);
    setToken(userToken);
    setRole(userRole || (employeeData && employeeData.role) || "employee");
  };

  const logout = () => {
    setEmployee(null);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        employee,
        token,
        role,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export default AuthContext;
