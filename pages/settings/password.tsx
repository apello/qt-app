import { prettyPrintDate, prettyPrintNormalDate } from "@/common/utils";
import Header from "@/components/Header";
import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut, updateEmail, updateProfile } from "firebase/auth";
import { NextPage } from "next"; 
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdatePassword: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [credentials, setCredentials] = useState({ displayName: '', email: ''});
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


    const handleAccountUpdate = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        if(user !== null && user !== undefined) {
            Promise.all([
                updateProfile(user, {
                    displayName: (credentials.displayName !== '') ? credentials.displayName : user.displayName,
                }),
                updateEmail(user, (credentials.email !== '') ? credentials.email! : user.email!)
            ])
            .then(() => {
                setAlert('Successfully update user account information!');
            })
            .catch((error) => {
                setAlert(`Error updating user account information: ${error}`);
            });
        }
    };

    if(user) { return (
        <>
            <Header />

            {(alert !== '') ? (
                <div style={{ border: '1px solid black', padding: '10px', margin: '5px'}}>{alert}</div>
            ) : ( <></> )}

            <h5><Link href='/landing'>Home</Link>/Settings</h5>
            <h1>Settings</h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings'>Profile</Link></p>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings/account'>Account</Link></p>
                <p style={{ border: '1px solid black', padding: '5px' }}>Password</p>
                <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/settings/goals'>Goals</Link></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px', width: '500px', gap: '10px' }}>
                <input 
                    type='button'
                    onClick={handleAccountUpdate}
                    value='Save Changes'
                    disabled={credentials.displayName === '' && credentials.email === ''} />

                    <label>
                        Full Name: {' '}
                        <input 
                        type='text'
                        value={credentials.displayName}
                        onChange={(e) => setCredentials({...credentials, displayName: e.target.value})} />
                    </label>       
                    <label>
                        Email: {' '}
                        <input 
                        type='text'
                        value={credentials.email}
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
                    </label>   
            </div>
        
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default UpdatePassword;