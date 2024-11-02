import {
    Card,
    Input,
    Button,
    Typography,
    Alert
} from "@material-tailwind/react";
import { useState } from "react";
import ExclamationIcon from "../icons/ExclamationIcon";


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export default function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(isValidEmail(email));
  }

  const handleSubmit = () => {
    try {
      console.log(password);
      console.log(email);
      setError("");
      setErrorMessage("");
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center mt-5">
        <Card color="transparent" className="p-4">
        <Typography variant="h4" color="blue-gray">
            Sign In
        </Typography>
        <Typography color="gray" className="my-1 font-normal">
            Nice to meet you! Enter your details to sign in.
        </Typography>
        {error && 
          <Alert variant="gradient" color="red" icon={<ExclamationIcon />}>
            {errorMessage}
          </Alert>
        }
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
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
            {!emailValid && <Typography
              color="red"
              className="flex items-center gap-2 text-xs font-normal"
            >
              <ExclamationIcon />
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
                onChange={(e) => {setPassword(e.target.value)}}
            />
            </div>
            <Button className="mt-6" type="submit" fullWidth>
            sign in
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-gray-900">
                Sign Up
            </a>
            </Typography>
          </form>
        </Card>
      </div>
  )
}
