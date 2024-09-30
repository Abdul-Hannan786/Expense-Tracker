"use client";

import { auth, signOutAtHome } from "@/Firebase/firebaseauth";
import { db, saveExpense } from "@/Firebase/firebasefirestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
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
        amount: parsedAmount,
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

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expense", id));
    } catch (error) {
      console.log(error);
    }
  };

  const editExpense = (index: number) => {
    console.log(allExpenses[index]);
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
    let allExpensesClone = [...allExpenses];

    readExpensesRealTime = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const expense = change.doc.data();
        expense.id = change.doc.id;
        if (change.type === "added") {
          allExpensesClone.push(expense);
        }
        if (change.type === "modified") {
          console.log("Expense Edit Successfully");
        }
        if (change.type === "removed") {
          allExpensesClone = allExpensesClone.filter((item) => item.id !== change.doc.id);
        }
      });
      setAllExpenses([...allExpensesClone]);
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
        allExpenses.map(({ id, title, amount, category, note }, index) => (
          <div key={title + index} style={{ fontFamily: "sans-serif" }}>
            <h2>Title : {title}</h2>
            <h2>Amount: {amount}</h2>
            <h3>Category: {category}</h3>
            {note !== "" ? <p>Note: {note}</p> : <></>}
            <button onClick={() => editExpense(index)}>Edit</button>
            <button
              onClick={() => {
                deleteExpense(id);
              }}
            >
              Delete
            </button>
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
