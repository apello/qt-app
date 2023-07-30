import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Landing: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const router = useRouter();

    onAuthStateChanged(auth, (authUser) => {
        if(authUser) {
            setUser(authUser);
        } else {
            setUser(null);
        }
    });
    

    const handleSignOut = () => {        
        signOut(auth)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(`Error with signing user out: ${error}`);
            })
    };

    if(user) {
        return (
            <>
                <h3>Welcome, {user.email}</h3>
                <button onClick={handleSignOut}>Sign out</button> 
            </>
        );
    } else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default Landing;