import Header from "@/components/Header";
import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Landing: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();

    useEffect( 
        () => {
            onAuthStateChanged(auth, (authUser) => {
                if(authUser) {
                    setUser(authUser);
                } else {
                    setUser(null);
                }
            });
        },[]
    );

    if(user) {
        return (
            <>
                <Header />
                <h3>Welcome, {user.email}</h3>

                <main style={{ display: 'flex' }}>
                    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <h3>Track Progress</h3>
                        <h5>Memorized a new verse? Revised a previous page? Track it here!</h5>
                        <button><Link href="progress/track-progress">Track Progress</Link></button>
                    </div>

                    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <h3>See Progress</h3>
                        <h5>Alhamdillulah, you have been working hard. To track your recent progress, click here.</h5>
                        <button><Link href="progress/view-recent-progress">See Progress</Link></button>
                    </div>
                </main>
              
            </>
        );
    } else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default Landing;