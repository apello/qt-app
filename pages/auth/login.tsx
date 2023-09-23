import { auth } from "@/firebase/clientApp";
import { Alert, Button, Container, CssVarsProvider, FormControl, FormLabel, IconButton, Input, Link, Sheet, Typography, Box, Divider } from "@mui/joy";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import AuthHeader from "@/components/AuthHeader";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GoogleIcon from '@mui/icons-material/Google';

// Add more restrictions to credentials
const Login: NextPage = (): JSX.Element => {
    const [credentials, setCredentials] = useState({ email: '', password: ''});
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [
        signInWithEmailAndPassword,
        userWithEmailAndPassword,
        loadingWithEmailAndPassword,
        errorWithEmailPassword
    ] = useSignInWithEmailAndPassword(auth); // react-firebase-hook

    const router = useRouter();

    // Email and Password: //

    // .then() and .catch() does not work with signInWithEmailAndPassword react-firebase-hook
    // Use loading and error values instead

    // .then()
    useEffect(() => {
        if(!loadingWithEmailAndPassword && userWithEmailAndPassword) {
            router.push('/landing')
        }
    },[loadingWithEmailAndPassword, router, userWithEmailAndPassword]);

    // .catch()
    useEffect(() => {
        if(errorWithEmailPassword) {
            setOpenAlert(true);
            setAlert('Email/password do not exist! Please try again.');
            console.log(`Login failed: ${errorWithEmailPassword}`);
        }
    },[errorWithEmailPassword]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        // commons/utils
        if(credentialsValid(credentials)) {
            signInWithEmailAndPassword(credentials.email, credentials.password)
        }
    }

    // Google: //

    const [
        signInWithGoogle, 
        userWithGoogle, 
        loadingWithGoogle, 
        errorWithGoogle
    ] = useSignInWithGoogle(auth);

     // .then()
     useEffect(() => {
        if(!loadingWithGoogle && userWithGoogle) {
            router.push('/landing')
        }
    },[loadingWithGoogle, router, userWithGoogle]);

    // .catch()
    useEffect(() => {
        if(errorWithGoogle) {
            setOpenAlert(true);
            setAlert('Google account does not exist! Please create an account or try again.');
            console.log(`Login failed: ${errorWithGoogle}`);
        }
    },[errorWithGoogle]);

    const handleGoogleLogin = async () => {
        signInWithGoogle();
    }


    return (
        <CssVarsProvider>
            <AuthHeader />
            <Container>
                {(openAlert) ? (
                    // Hide Alert
                    <Alert 
                        variant="soft" 
                        sx={{ my: 2 }}
                        endDecorator={
                            <IconButton 
                                variant="plain" 
                                size="sm" 
                                color="neutral" 
                                onClick={() => setOpenAlert(false)}>
                                <CloseRoundedIcon />
                            </IconButton>
                        }>
                            {alert}
                    </Alert>
                ) : ( <></> )}
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
                            <Box sx={{ display: 'flex' }}>
                                <FormLabel>Password:</FormLabel>
                                <Typography level='body-sm' sx={{ display: 'inherit', justifyContent: 'end', alignItems: 'start', width: '100%'}}>
                                    <Link href='/auth/forgot-password'>Forgot password?</Link>
                                </Typography>
                            </Box>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter password:"
                                onChange={({ target }) => setCredentials({ ...credentials, password: target.value })} 
                                required />
                        </FormControl>       
                        {(!loadingWithEmailAndPassword) ? (
                            <Button type="submit" sx={{ mt: 1, width: '100%' }}>Log in</Button>
                        ) : (
                            <Button
                            loading
                            loadingPosition="end"
                            endDecorator={<SendIcon />}
                            variant="solid"
                            sx={{ width: '100%'}}>
                                Log in
                            </Button>
                        )}
                    </form>
                    
                    <Divider>or</Divider>
                    
                     {(!loadingWithGoogle) ? (
                        <Button 
                            color="neutral"
                            variant="outlined" 
                            onClick={handleGoogleLogin}
                            startDecorator={<GoogleIcon />}>Sign in with Google</Button>
                    ) : (
                        <Button 
                            loading
                            loadingPosition="end"
                            endDecorator={<SendIcon />}
                            variant="solid"
                            startDecorator={<GoogleIcon />}>Sign in with Google</Button>
                    )}
                   

                </Sheet>
            </Container>
        </CssVarsProvider>
    );
}

export default Login;