import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute/index.jsx";

const Login = lazy(() => import("./pages/auth/Login/index.jsx"));
const NotFound = lazy(() => import("./pages/NotFound/index.jsx"));
const Register = lazy(() => import("./pages/auth/Register/index.jsx"));
const Owner = lazy(() => import("./pages/owner/index.jsx"));
const Customer = lazy(() => import("./pages/customer/index.jsx"));
const Home = lazy(() => import("./pages/home/index.jsx"));

const pageData = {
  whoEntered: null,
  currentUser: null,
  customer: [],
  owner: [],
};

function App() {
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState(pageData);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const recordTheUserData = (data) => {
    console.log(user);
    setUserData((prev) => [...prev, data]);
  };

  const whoenteredtopage = (person) => {
    const existingUsersData = localStorage.getItem("user");
    const existingUsers = JSON.parse(existingUsersData);
    const updatedUserData = { ...existingUsers, whoEntered: person };
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const logout = () => {
    setUser(pageData);
    setUserData([]);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, logout, whoenteredtopage, recordTheUserData }}
    >
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/owner" element={<Owner />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/customer" element={<Customer />} />
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;
