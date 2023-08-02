'use client';

import { auth } from "@/firebase/clientApp";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = (): JSX.Element => {

    const router = useRouter();

    const handleSignOut = () => {        
        signOut(auth)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(`Error with signing user out: ${error}`);
            })
    };

    return (
        <div style={{ display: 'flex', padding: '5px', borderBottom: '1px solid black' }}>
            <h1 style={{ display: 'inherit', flexGrow: '1' }}>
                <Link href='/landing'>Dashboard</Link>
            </h1>
            <nav style={{ display: 'inherit', flexDirection: 'row',flexGrow: '1', justifyContent: 'flex-end', padding: '15px'}}>
                    <Link href='/landing' style={{ marginRight: '10px' }}>Home</Link>
                    <a onClick={handleSignOut}>Sign out</a>               
            </nav>
        </div>
    );
}

export default Header;