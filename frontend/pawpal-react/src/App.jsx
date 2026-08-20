import {Route, Routes} from "react-router-dom";


import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import './App.css';

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewPet from "./pages/NewPet.jsx";
import Health from "./pages/Health.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
function App() {
  return(
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/NewPet" element={<NewPet />} /> 
            <Route path="/pets/:petId/Health" element={<Health />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Profile" element={<Profile />} /> 
            <Route path= "/About" element={<About />} />
        </Routes>
    </>
  );
}
export default App;
