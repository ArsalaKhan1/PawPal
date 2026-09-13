import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import api from "../utils/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            setStatusType("error");
            setStatusMessage("Please complete all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setStatusType("error");
            setStatusMessage("Passwords do not match.");
            return;
        }

        try {
            await api.post("/auth/register", {
                name: fullName,
                email,
                password,
            });

            setStatusType("success");
            setStatusMessage("Account created successfully. You can log in now.");
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            setStatusType("error");
            setStatusMessage(err.response?.data?.message || "Error creating account. Please try again.");
        }
    }

    return (
        <>
            <main>
                <form className="petForm" onSubmit={handleRegister}>
                    <h2 className="pageHeading">Create Account</h2>
                    <p>Welcome to PawPal! Please create your account.</p>
                    {statusMessage && (
                        <p className={statusType === "success" ? "successMessage" : "errorMessage"}>
                            {statusMessage}
                        </p>
                    )}
                    <p>
                        Already have one? <Link to="/login">Login instead</Link>
                    </p>
                    <Input
                        label="Full Name"
                        type="text"
                        name="fullname"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Create Account</Button>
                </form>
            </main>
        </>
    );
}

export default Register;