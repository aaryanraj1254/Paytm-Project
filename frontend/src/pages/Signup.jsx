import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export default function Signup() {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", formData);
            
            if (response.data.success) {
                navigate("/dashboard"); 
            } else {
                setError(response.data.message || "Signup failed. Please try again."); 
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during signup.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox
                        placeholder="John"
                        label={"First Name"}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <InputBox
                        placeholder="Doe"
                        label={"Last Name"}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <InputBox
                        placeholder="harkirat@gmail.com"
                        label={"Email"}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <InputBox
                        placeholder="123456"
                        label={"Password"}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="pt-4">
                        <Button label={"Sign up"} onClick={handleSignup} />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );
}
