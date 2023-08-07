import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        const onlisten = onAuthStateChanged(auth, (authUser) => {
            authUser
                ? setUser(authUser)
                : setUser(null);
        });
        return () => {
            onlisten();
        }
    },[]);

    if(user) { return (
        <>
            <h1><b>Welcome to Quran Tracker App</b></h1>
            <button>
                <Link href='/landing'>
                    Go Home
                </Link>
            </button>
        </>
    )} else { return (
        <>
            <h1><b>Welcome to Quran Tracker App</b></h1>
            <button>
                <Link href='auth/login'>
                    Login
                </Link>
            </button>
            <button>
                <Link href='auth/signup'>
                    Signup
                </Link>
            </button>
        </>

    )};
}

export default Home;