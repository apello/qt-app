import { auth } from "@/firebase/clientApp";
import { Alert, Button, Container, CssVarsProvider, FormControl, FormLabel, IconButton, Input, Link, Sheet, Typography } from "@mui/joy";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import AuthHeader from "@/components/AuthHeader";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Add more restrictions to credentials
const Login: NextPage = (): JSX.Element => {
    const [credentials, setCredentials] = useState({ email: '', password: ''});
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error
    ] = useSignInWithEmailAndPassword(auth); // react-firebase-hook

    const router = useRouter();

    // .then() and .catch() does not work with signInWithEmailAndPassword react-firebase-hook
    // Use loading and error values instead

    // .then()
    useEffect(() => {
        if(!loading && user) {
            router.push('/landing')
        }
    },[loading, router, user]);

    // .catch()
    useEffect(() => {
        if(error) {
            setOpenAlert(true);
            setAlert('Email/password do not exist! Please try again.');
            console.log(`Login failed: ${error}`);
        }
    },[error]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        // commons/utils
        if(credentialsValid(credentials)) {
            signInWithEmailAndPassword(credentials.email, credentials.password)
        }
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

                    <Typography>
                        <Link href='/auth/forgot-password'>Forgot password?</Link>
                    </Typography>

                </Sheet>
            </Container>
        </CssVarsProvider>
    );
}

export default Login;