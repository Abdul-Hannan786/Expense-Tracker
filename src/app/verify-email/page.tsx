"use client";

import { emailVerification } from "@/Firebase/firebaseauth";
// import { app } from "@/Firebase/firebaseconfig";
// import { getAuth, sendEmailVerification } from "firebase/auth";
import React from "react";

// const auth = getAuth(app)
// const emailVerification = () => {
//   sendEmailVerification(auth.currentUser!)
//   .then(() => {
//     // Email verification sent!
//     // ...
//   });
// }
const VerifyEmail = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        height: "96vh",
        width: "96vw"
      }}
    >
      <h1>Please Verify Your Email Address</h1>
      <button
        onClick={() => {emailVerification}}
        style={{
          color: "white",
          padding: "9px",
          backgroundColor: "blue",
          border: "none",
          borderRadius: "10px",
          width: "20vw",
          fontWeight: "700"
        }}
      >
        Verify
      </button>
    </div>
  );
};

export default VerifyEmail;
