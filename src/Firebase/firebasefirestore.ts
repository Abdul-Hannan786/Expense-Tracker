import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebaseconfig";
import { auth } from "./firebaseauth";

type UserType = {
  email: string;
  userName: string;
  uid: string;
};

type expenseType = {
  title: string;
  amount: number | string;
  category: string;
  date: string;
  note?: string;
  userID : string

};

export const db = getFirestore(app);

export async function saveUser(user: UserType) {
  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.log(error);
  }
}

export async function saveExpense(expense: expenseType) {
  if(auth.currentUser){
    const uid = auth.currentUser?.uid;
    expense.userID = uid
  }
  try {
    const collectionRef = collection(db, "expense");
    await addDoc(collectionRef, expense);
  } catch (error) {
    console.log(error);
  }
}
