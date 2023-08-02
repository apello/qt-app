import { auth } from "@/firebase/clientApp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";


// Add more restrictions
const credentialsValid = (credentials: any): boolean => {
    return credentials.email !== "" && credentials.password !== "";
}

const Login: NextPage = (): JSX.Element => {
    const [credentials, setCredentials] = useState({ email: '', password: ''});
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(credentialsValid(credentials)) {
            signInWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then(() => {
                    router.push('/landing');
                })
                .catch(() => {
                    setError('Username/password combination does not match! Please try again.');
                })
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Login:</h3>
                <label>
                    Email:
                    <input 
                        type='email' 
                        placeholder='Enter email...'
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} 
                        required />
                </label><br/><br/>
                <label>
                    Password:
                    <input 
                        type='password' 
                        placeholder='Enter password...'
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
                        required />
                </label><br/><br/>
                <input type='submit' />
            </form>
            <p>{error}</p>
        </div>
    );
}

export default Login;