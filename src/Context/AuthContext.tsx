"use client";

import { app } from "@/Firebase/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserType = {
  email: string | null;
  uid: string;
};
type AuthContextType = {
  user: UserType | null;
};

const AuthContextProvider = createContext<AuthContextType>({
  user: { email: "", uid: "" },
});

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();
 
  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        const { email, uid, emailVerified } = loggedInUser;
        setUser({ email, uid });
        emailVerified ? router.push("/") : router.push("./verify-email");
      } else {
        console.log("inside onauthstatechange else statement");
        setUser(null);
        router.push("/signin");
      }
    });
  }, [router]);

  return (
    <AuthContextProvider.Provider value={{ user }}>
      {children}
    </AuthContextProvider.Provider>
  );
};

export default AuthContext;

export const UseAuthContext = () => useContext(AuthContextProvider);
