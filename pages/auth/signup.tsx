import { registrationCredentialsValid } from "@/common/utils";
import { auth } from "@/firebase/clientApp";
import { styled, Sheet, CssVarsProvider, Box, Grid, Typography, FormControl, FormLabel, Input, Button } from "@mui/joy";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import AuthHeader from "@/components/AuthHeader";

const SignUp: NextPage = (): JSX.Element => {
    const [registration, setRegistration] = useState({ displayName: '', email: '', password: ''});
    const [message, setMessage] = useState("")
    const [
        createUserWithEmailAndPassword,
        users,
        loading,
    ] = useCreateUserWithEmailAndPassword(auth);

    const router = useRouter();

    // TODO: Add password requirements and validation for email and name
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(registrationCredentialsValid(registration)) {
            createUserWithEmailAndPassword(registration.email, registration.password)
                .then((credentials) => {
                    // Add name
                    const user = credentials!.user;
                    Promise.all([
                        updateProfile(user, {
                            displayName: registration.displayName
                        }),
                        // Send email verification
                        sendEmailVerification(user)
                    ])
                        .then(() => {
                            // Push to landing
                            router.push({
                                pathname: '/landing',
                                search: '?status=new-user' 
                            });
                        })
                        .catch((error) => {
                            setMessage('Error updating user profile and sending email verification. Redirecting to landing page in 5 seconds.');
                            console.log(`Error updating user profile and sending email verification: ${error}`);
                            setTimeout(() => {
                                // Push to landing after 5 seconds
                                router.push({
                                    pathname: '/landing',
                                    search: '?status=new-user' 
                                });
                            }, 5000);
                        });
                })
                .catch((error) => {
                    setMessage('UseEmailrname/password combination does not match! Please try again.');
                    console.log(`Error creating user: ${error}`);
                })
        } else {
            setMessage(`
                Email/password does not meet these requirements:
                    Name must only contain letters and be longer than 1 character.
                    Email must be valid. 
                    Password must be longer than 8 characters.
            `);
        }
    }

    return (
        <CssVarsProvider>
            <AuthHeader />
            <Sheet 
                sx={{
                    width: 300,
                    mx: 'auto',
                    my: 4,
                    py: 3,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    border: '1px solid #aeaeae',
                    borderRadius: 'sm'
                }}>
                <div>
                    <Typography level="h3" component="h1">
                        Welcome!
                    </Typography>
                    <Typography level='body-md'>Sign up to continue.</Typography> 
                </div>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel>Full Name:</FormLabel>
                        <Input
                            name="text"
                            type="text"
                            placeholder="Enter your full name:"                            
                            onChange={({ target }) => setRegistration({ ...registration, displayName: target.value })}
                            required />
                    </FormControl>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel>Email:</FormLabel>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter your email:"
                            onChange={({ target }) => setRegistration({ ...registration, email: target.value })}
                            required />
                    </FormControl>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel>Password:</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Enter a password:"
                            onChange={({ target }) => setRegistration({ ...registration, password: target.value })}
                            required />
                    </FormControl>   
                    {(!loading) ? (
                        <Button type="submit" sx={{ mt: 1 }}>Sign Up</Button>
                    ) : (
                        <Button
                        loading
                        loadingPosition="end"
                        endDecorator={<SendIcon />}
                        variant="solid"
                        >
                        Sign Up
                        </Button>
                    )}
                </form>

            <Typography
                fontSize="sm"
                sx={{ alignSelf: 'center' }}
            >
                {message}      
            </Typography>

            </Sheet>
        </CssVarsProvider>
    );
}

export default SignUp;