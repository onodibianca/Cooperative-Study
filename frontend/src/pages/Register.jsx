import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput"; // import the new component

function Register() {
  const [msg, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    const newErrors = {
      username: username.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword !== password,
    };

    setErrors(newErrors);

    if (newErrors.username || newErrors.password || newErrors.confirmPassword) {
      if (newErrors.confirmPassword) {
        setMessage("Passwords do not match.");
      } else {
        setMessage("Please fill in all fields correctly.");
      }
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account successfully created! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2000); // wait 2 seconds before redirecting
      } else {
        setMessage(data.msg || "Oh no! Register has failed...");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("An error occurred, try again later! <3");
    }
  };

  return (
    <div className="bg-green-100 text-grey p-4 flex justify-center">
      <div className="bg-orange-200/80 border-orange-900 rounded-3xl w-[800px] p-40 shadow-xl relative">
        <div className="text-[50px] absolute inset-x-0 top-4 text-center font-bold">
          REGISTER
        </div>

        <div className="flex flex-col space-y-8 mt-20">
          {/* Username */}
          <div className="flex items-center">
            <label className="w-48 text-[20px]">Username:</label>
            <input
              className={`border ${
                errors.username ? "border-red-500" : "border-lime-100"
              } rounded px-10 py-1 flex-1`}
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: false });
              }}
            />
          </div>

          {/* Password */}
          <div className="flex items-center">
            <label className="w-48 text-[20px]">Password:</label>
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: false });
              }}
              placeholder="Enter your password"
              hasError={errors.password}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center">
            <label className="w-48 text-[20px]">Confirm Password:</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: false });
              }}
              placeholder="Re-enter your password"
              hasError={errors.confirmPassword}
            />
          </div>
        </div>

        <button
          className="absolute bottom-10 right-10 px-10 py-4 bg-green-100 hover:bg-green-400 text-grey rounded-xl"
          onClick={handleRegister}
        >
          Next
        </button>

        <Link to="/" className="mt-6 text-lime-800 block text-center">
          Already have an account? Login!
        </Link>

        {msg && <div className="text-center text-red-600 mt-6">{msg}</div>}
      </div>
    </div>
  );
}

export default Register;
