"use client";

import { auth, signOutAtHome } from "@/Firebase/firebaseauth";
import { db, saveExpense } from "@/Firebase/firebasefirestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [allExpenses, setAllExpenses] = useState<DocumentData[]>([]);
  const date = new Date().toDateString();

  const addExpense = () => {
    const parsedAmount = Number(amount);
    if (title.trim() !== "" && parsedAmount > 0) {
      saveExpense({
        title,
        amount,
        category,
        note,
        date,
        userID: "",
      });
    } else {
      alert("Please fill all the fields");
    }
    setTitle("");
    setAmount("");
    setNote("");
    setCategory("Food");
  };

  useEffect(() => {
    const detachedOnAuthListner = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchExpensesRealTime();
      } else {
        router.push("./signin");
      }
    });

    return () => {
      if (readExpensesRealTime) {
        readExpensesRealTime();
        detachedOnAuthListner();
      }
    };
  }, []);

  let readExpensesRealTime: Unsubscribe;

  const fetchExpensesRealTime = () => {
    const collectionRef = collection(db, "expense");
    const currentUserUID = auth.currentUser?.uid;
    const condition = where("userID", "==", currentUserUID);
    const q = query(collectionRef, condition);
    const allExpensesClone = [...allExpenses];

    readExpensesRealTime = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const expense = change.doc.data();
          expense.id = change.doc.id;
          allExpensesClone.push(expense);
          setAllExpenses([...allExpensesClone]);
        }
        if (change.type === "modified") {
          console.log("data modified");
        }
        if (change.type === "removed") {
        }
      });
    });
  };

  return (
    <>
      <h1 style={{ fontFamily: "sans-serif" }}>Create your expenses freely</h1>
      <input
        type="text"
        placeholder="Enter Your Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter Your Amount"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setAmount(value);
          } else {
            alert("Please enter a valid number");
          }
        }}
      />
      <br />
      <br />
      <label htmlFor="category">Select Your Category </label>
      <select
        id="category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Bills">Bills</option>
        <option value="Education">Education</option>
        <option value="Investments">Investments</option>
        <option value="Luxuries">Luxuries</option>
        <option value="Others">Others</option>
      </select>
      <br />
      <br />
      <textarea
        placeholder="Optional Note"
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
        }}
      ></textarea>
      <br />
      <br />
      <button onClick={addExpense}>Create Expense</button>
      <br />
      <br />

      {allExpenses.length > 0 ? (
        allExpenses.map(({ title, amount, category, note }, index) => (
          <div key={title + index}>
            <h1>Title : {title}</h1>
            <h1>Amount: {amount}</h1>
            <h2>Category: {category}</h2>
            {note !== "" ? <p>Note: {note}</p> : <></>}
            <hr />
          </div>
        ))
      ) : (
        <></>
      )}
      <button
        onClick={signOutAtHome}
        style={{
          color: "white",
          padding: "9px",
          backgroundColor: "blue",
          border: "none",
          borderRadius: "10px",
          width: "20vw",
          fontWeight: "700",
        }}
      >
        Sign Out
      </button>
    </>
  );
}
