import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Hero from "../components/Hero";  
import Navbar from "../components/Navbar";  
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function handleLogin(e){
        e.preventDefault();
        console.log({
            email,
            password
        });
    }
    return(
        <>
        <Navbar/>
        <main>
            <form className="petForm" onSubmit={handleLogin}>
                <h2>Welcome Back!</h2>
                <p>Login to continue managing your pets' care and health.</p>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <Button type="submit">Login</Button>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register here
                    </Link>
                </p>
            </form>
        </main>
        </>
    );
}

export default Login;