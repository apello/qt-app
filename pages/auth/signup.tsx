import { registrationCredentialsValid } from "@/common/utils";
import { auth } from "@/firebase/clientApp";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

const SignUp: NextPage = (): JSX.Element => {
    const [registration, setRegistration] = useState({ displayName: '', email: '', password: ''});
    const [error, setError] = useState('');

    const router = useRouter();

    // TODO: Add password requirements and validation for email and name
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(registrationCredentialsValid(registration)) {
            createUserWithEmailAndPassword(auth, registration.email, registration.password)
                .then((credentials) => {
                    // Add name
                    const user = credentials.user;
                    updateProfile(user, {
                        displayName: registration.displayName
                    })
                        .catch((error) => {
                            console.log(`Error updating user profile: ${error}`);
                        });
                    // Send email verification
                    sendEmailVerification(user)
                        .catch((error) => {
                            console.log(`Error sending email verification: ${error}`);
                        })
                    // Push to landing
                    router.push({
                        pathname: '/landing',
                        search: '?status=new-user' 
                    });
                })
                .catch(() => {
                    setError('Username/password combination does not match! Please try again.');
                    console.log(`Error creating user: ${error}`);
                })
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Login:</h3>
                <label>
                    Full Name:
                    <input 
                        type='text' 
                        placeholder='Enter name...'
                        onChange={(e) => setRegistration({ ...registration, displayName: e.target.value })} 
                        required />
                </label><br/><br/>
                <label>
                    Email:
                    <input 
                        type='email' 
                        placeholder='Enter email...'
                        onChange={(e) => setRegistration({ ...registration, email: e.target.value })} 
                        required />
                </label><br/><br/>
                <label>
                    Password:
                    <input 
                        type='password' 
                        placeholder='Enter password...'
                        onChange={(e) => setRegistration({ ...registration, password: e.target.value })} 
                        required />
                </label><br/><br/>
                <input type='submit' />
            </form>
            <p>{error}</p>
        </div>
    );
}

export default SignUp;