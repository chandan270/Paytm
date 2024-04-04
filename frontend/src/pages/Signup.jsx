import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signup = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
        <div className="bg-white rounded-lg w-80 text-center h-max px-4 p-2">
            <Heading label="Sign Up" />
            <SubHeading label="Enter your information to create an account" />
            <InputBox onChange={(e) => {
                setFirstName(e.target.value)
            }} label="First Name" placeholder="John" />
            <InputBox onChange={(e) => {
                setLastName(e.target.value)
            }} label="Last Name" placeholder="Doe" />
            <InputBox onChange={(e) => {
                setUsername(e.target.value)
            }} label="Email" placeholder="chandan@gmail.com" />
            <InputBox onChange={(e) => {
                setPassword(e.target.value)
            }} label="Password" placeholder="123456" />
            <div className="pt-4">
            <Button onClick={async () => {
                const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                    username,
                    firstName,
                    lastName,
                    password
                });
                if(response.status == 200) {
              localStorage.setItem("token", response.data.token)
              navigate("/dashboard");
            }
            }} label="Sign Up" />
            </div>
            <BottomWarning label="Already have an account?" buttonText="Sign in" to={"/signin"} />
        </div>
        
    </div>        
    </div>
}