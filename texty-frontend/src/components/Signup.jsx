import {
    Card,
    Input,
    Button,
    Typography,
    Alert
} from "@material-tailwind/react";
import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../context/useAuth";
import ExclamationIcon from "../icons/ExclamationIcon";
import { Link, useNavigate } from "react-router-dom";
import CheckMark from "../icons/CheckMark";
import XMark from "../icons/XMark";


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


const isPasswordValid = (password) => {
  return [
    {
      message: "Password must be at least 8 characters long",
      isValid: password.length >= 8
    },
    {
      message: "Password must contain at least one Uppercase letter",
      isValid: /[A-Z]/.test(password)
    },
    {
      message: "Password must contain at least one number",
      isValid: /[0-9]/.test(password)
    },
    {
      message: "Password must contain at least one special character",
      isValid: /[!@#$%^&*(),.?{}|<>]/.test(password)
    }
  ]
}

export default function SimpleRegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState([]);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !email || !password) {
      setError(true);
      setErrorMessage("All information must be filled");
      return;
    }

    if(!emailValid) {
      setError(true);
      setErrorMessage("The given email is not valid");
      return;
    }
    console.log("name is = ", name);
    console.log("Email is = ", email);
    console.log("password is = ", password);
    try {
      const res = await axios.post("http://localhost:5000/user/signup", {
        name: name,
        email: email,
        password: password
      });
      signup(res.data.token);
      navigate('/signin');
    } catch(err) {
      if (err.response) {
        console.log("Server responded with an error:", err.response.status);
        
        // Handle 400 status specifically for "Email already exists"
        if (err.response.status === 400) {
          setError(true);
          setErrorMessage(err.response.data.message);
        } else {
          setError(true);
          setErrorMessage("An error occurred. Please try again later.");
        }
      } else {
        // Handle network errors or other unexpected errors
        console.log("An error occurred:", err);
        setError(true);
        setErrorMessage("Network error - Unable to reach the server.");
      }
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(isValidEmail(email));
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword);
    setPasswordError(isPasswordValid(newPassword));
  }

  const passwordValid = passwordError.every((error) => error.isValid);

  return (
      <div className="flex justify-center mt-5">
        <Card color="transparent" className="p-4">
        <Typography variant="h4" color="blue-gray">
            Sign Up
        </Typography>
        <Typography color="gray" className="my-1 font-normal">
            Nice to meet you! Enter your details to register.
        </Typography>
        {error && 
          <Alert variant="gradient" color="red" icon={<ExclamationIcon />}>
            {errorMessage}
          </Alert>
        }
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Name
            </Typography>
            <Input
                size="lg"
                placeholder="John Brandy"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
                onChange={(e) => setName(e.target.value)}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
            </Typography>
            <Input
                size="lg"
                type="email"
                error={!emailValid}
                success={emailValid}
                placeholder="johnbrandy@gmail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 mb-0"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
                onChange={handleEmailChange}
            />
            {!emailValid && email.length !== 0 &&
              <Typography
                color="red"
                className="flex items-center gap-2 text-xs font-normal"
              >
                <ExclamationIcon />
                Please give a proper email. e.g. johnbrandy@gmail.com
              </Typography>
            }
            <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
            </Typography>
            <Input
                type="password"
                size="lg"
                error={!passwordValid}
                success={passwordValid}
                placeholder="Please enter password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
                onChange={handlePasswordChange}
            />
            {
              passwordError.map((error, index) => (
                <div key={index} className="flex flex-row items-center text-sm">
                  {error.isValid ?
                    (
                      <div className="text-green-500 bg-green-100 p-2 rounded-full shrink-0 me-2">
                        <CheckMark />
                      </div>
                    )
                    :
                    (
                      <div className="text-red-500 bg-red-100 p-2 rounded-full shrink-0 me-2">
                        <XMark />
                      </div>
                    )
                  }
                  <div>{error.message}</div>
                </div>
              ))
            }
            </div>
            <Button className="mt-6" type="submit" fullWidth disabled={!emailValid && !passwordValid}>
              sign up
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-gray-900">Sign In</Link>
            </Typography>
          </form>
        </Card>
      </div>
  );
}