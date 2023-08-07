import { prettyPrintDate, prettyPrintNormalDate } from "@/common/utils";
import Header from "@/components/Header";
import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
import { NextPage } from "next"; 
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [alert, setAlert] = useState('');

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

    const verifyEmail = () => {
        if(user !== undefined && user !== null) {
            sendEmailVerification(user)
                .then(() => {
                    setAlert('Email verification successfully sent! Please check your email for the next steps.');
                })
                .catch((error) => {
                    setAlert(`Error sending email verification: ${error}`);
                })
        }
    }

    if(user) {      
        return (
        
        <>
            <Header />

            {(alert !== '') ? (
                <div style={{ border: '1px solid black', padding: '10px', margin: '5px'}}>{alert}</div>
            ) : ( <></> )}

            <h5><Link href='/landing'>Home</Link>/Settings</h5>
            <h1>Settings</h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ border: '1px solid black', padding: '5px' }}>Profile</p>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings/account'>Account</Link></p>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings/password'>Password</Link></p>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings/goals'>Goals</Link></p>
            </div>

            <div style={{ display: 'flex', flexDirection:'row', border: '1px solid black', padding: '10px', width: '500px' }}>
                <div>
                    {(user.photoURL) ? <Image src={user.photoURL} alt="User profile" /> : <p>No profile yet.</p>}
                </div>
                <div>
                    <h3>User Information: </h3>
                    <ul>
                        <li><h5>Full Name: {user.displayName}</h5></li>
                        <li><h5>Email: {user.email} - {(user.emailVerified) ? <p>Verified</p> : <a style={{ color: 'purple', textDecoration: 'underline', cursor: 'pointer' }}onClick={verifyEmail}>Not Verified</a>}</h5></li>
                        <li><h5>Joined: {prettyPrintNormalDate(user.metadata.creationTime)}</h5></li>
                        <li><h5>Last Sign In: {prettyPrintNormalDate(user.metadata.lastSignInTime)}</h5></li>
                    </ul>
                </div>

            </div>
        
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default Profile;