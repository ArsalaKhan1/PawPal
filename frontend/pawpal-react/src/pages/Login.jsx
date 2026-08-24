import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await Axios.post("http://localhost:5000/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed. Please try again.");
        }
    }

    return (
        <>
            <Navbar />
            <main>
                <form className="petForm" onSubmit={handleLogin}>
                    <h2 className="pageHeading">Welcome Back!</h2>
                    <p>Login to continue managing your pets' care and health.</p>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Login</Button>
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </form>
            </main>
        </>
    );
}

export default Login;