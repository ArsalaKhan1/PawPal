import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import './App.css';

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewPet from "./pages/NewPet.jsx";
import Health from "./pages/Health.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";

function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/pets" element={<RequireAuth><NewPet /></RequireAuth>} />
        <Route path="/pets/:petId/health" element={<RequireAuth><Health /></RequireAuth>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/about" element={<About />} />
        <Route path="/upcoming-vaccinations" element={<RequireAuth><Navigate to="/profile" replace /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default App;
