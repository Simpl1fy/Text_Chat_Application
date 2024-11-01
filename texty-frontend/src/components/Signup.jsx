import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/useAuth";


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function SimpleRegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);

  const { signup } = useAuth();

  // useEffect(() => {
  //   console.log("isLoggedIn =", isLoggedIn);
  //   console.log("localToken =", localToken);
  // }, [isLoggedIn, localToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!emailValid) {
      console.log("Email is not valid");
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
      console.log(res.data.token);
      signup(res.data.token);
    } catch(err) {
      console.log("An error occured = ", err);
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(isValidEmail(email));
  }

  return (
      <div className="flex justify-center mt-5">
        <Card color="transparent" className="p-4">
        <Typography variant="h4" color="blue-gray">
            Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
            Nice to meet you! Enter your details to register.
        </Typography>
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
                required
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
                required
                onChange={handleEmailChange}
            />
            {!emailValid && <Typography
              color="red"
              className="flex items-center gap-2 text-xs font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Please give a proper email. e.g. johnbrandy@gmail.com
            </Typography>}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
            </Typography>
            <Input
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
                required={true}
                onChange={(e) => {setPassword(e.target.value)}}
            />
            </div>
            <Button className="mt-6" type="submit" fullWidth>
            sign up
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <a href="#" className="font-medium text-gray-900">
                Sign In
            </a>
            </Typography>
          </form>
        </Card>
      </div>
  );
}