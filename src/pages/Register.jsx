import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 shadow-xl rounded-lg w-80"
        onSubmit={registerUser}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3 bg-gray-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3 bg-gray-100"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700">
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
