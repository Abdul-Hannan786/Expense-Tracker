"use client";

import { loginWithEmailPassword } from "@/Firebase/firebaseauth";
import Link from "next/link";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <input
        type="text"
        placeholder="Enetr Your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />
      <br />
      <button
        onClick={() => {
          loginWithEmailPassword(email, password);
        }}
      >
        Sign In
      </button>
      <p>
        Dont have have an account?{" "}
        <span>
          <Link href={"/signup"}>Sign Up Here</Link>
        </span>
      </p>
    </>
  );
};

export default SignIn;
