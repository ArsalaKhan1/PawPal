import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";  

function Register(){
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    function handleRegister(e){
        e.preventDefault();
        console.log({
            fullName,
            email,
            password,
            confirmPassword
        });

    }
    return(
        <>
        <Navbar />
        <main>
            <form className="petForm" onSubmit={handleRegister}>
                <h2>Create Account</h2>
                <p>
                    Welcome to PawPal! Please create your account.
                </p>
                <p>
                    Already have one?{" "}
                    <Link to="/login">
                        Login instead
                    </Link>
                </p>
                <Input
                    label="Full Name"
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e)=>setFullName(e.target.value)}
                />
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                <Button type="submit">
                    Create Account
                </Button>
            </form>
        </main>
        </>
    );
}
export default Register;