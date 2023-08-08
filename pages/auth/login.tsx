import { auth } from "@/firebase/clientApp";
import { Box, Button, CssVarsProvider, FormControl, FormLabel, Grid, Input, Link, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import AuthHeader from "@/components/AuthHeader";


// Add more restrictions to credentials
const Login: NextPage = (): JSX.Element => {
    const [credentials, setCredentials] = useState({ email: '', password: ''});
    const [message, setMessage] = useState("")
    const [
        signInWithEmailAndPassword,
        user,
        loading,
    ] = useSignInWithEmailAndPassword(auth);

    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(credentialsValid(credentials)) {
            signInWithEmailAndPassword(credentials.email, credentials.password)
                .then(() => {
                    router.push('/landing');
                })
                .catch(() => {
                    setMessage('Email/password do not exist! Please try again.');
                });
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
                <Typography level='body-md'>Log in to continue.</Typography> 
                </div>

                <form onSubmit={(e) => handleSubmit(e)}>
                <FormControl sx={{ mb: 1 }}>
                    <FormLabel>Email:</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter email:"
                        onChange={({ target }) => setCredentials({ ...credentials, email: target.value })}
                        required />
                </FormControl>
                <FormControl sx={{ mb: 1 }}>
                    <FormLabel>Password:</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter password:"
                        onChange={({ target }) => setCredentials({ ...credentials, password: target.value })} 
                        required />
                </FormControl>       
                {(!loading) ? (
                    <Button type="submit" sx={{ mt: 1 }}>Log in</Button>
                ) : (
                    <Button
                    loading
                    loadingPosition="end"
                    endDecorator={<SendIcon />}
                    variant="solid"
                    >
                    Log in
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

export default Login;