import { registrationCredentialsValid } from "@/common/utils";
import { auth } from "@/firebase/clientApp";
import { styled, Sheet, CssVarsProvider, Box, Grid, Typography, FormControl, FormLabel, Input, Button, Tooltip, Alert, IconButton, Container, Divider } from "@mui/joy";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import AuthHeader from "@/components/AuthHeader";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GoogleIcon from '@mui/icons-material/Google';

const SignUp: NextPage = (): JSX.Element => {
    const [registration, setRegistration] = useState({ displayName: '', email: '', password: ''});
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error
    ] = useCreateUserWithEmailAndPassword(auth);
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    const router = useRouter();

    // then
    useEffect(() => {
        if(!loading && user) {
            const registeredUser = user!.user;
            Promise.all([
                updateProfile(registeredUser, {
                    displayName: registration.displayName
                }),
                // Send email verification
                sendEmailVerification(registeredUser)
            ])
                .then(() => {
                    // Push to landing
                    router.push({
                        pathname: '/landing',
                        search: '?status=new-user' 
                    });
                })
                .catch((error) => {
                    setOpenAlert(true);
                    setAlert('Error updating user profile and sending email verification. Redirecting to landing page in 5 seconds.');
                    console.log(`Error updating user profile and sending email verification: ${error}`);
                    setTimeout(() => {
                        // Push to landing after 5 seconds
                        router.push({
                            pathname: '/landing',
                            search: '?status=new-user' 
                        });
                    }, 5000);
                });
        }
    },[loading, registration.displayName, router, user]);

    // catch
    useEffect(() => {
        if(error) {
            setOpenAlert(true);
            setAlert('Error registering user! Please try again.');
            console.log(`Error creating user: ${error}`);
        }
    },[error]);

    // TODO: Add password requirements and validation for email and name
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(registrationCredentialsValid(registration)) {
            createUserWithEmailAndPassword(registration.email, registration.password)
        } else {
            setOpenAlert(true);
            setAlert(`
                Given values do not meet these requirements:
                    Name must only contain letters and must be 1 character or greater.
                    Email must be valid. 
            `);
        }
    };

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
            router.push({
                pathname: '/landing',
                search: '?status=new-user' 
            });
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
                    <Typography level='body-md'>Sign up to continue.</Typography> 
                </div>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title='Name must only contain letters and be longer than 1 character.'>
                                <InfoOutlinedIcon sx={{ color: 'text.secondary', height: '15px' }} />
                            </Tooltip>
                            Full Name:
                        </FormLabel>
                        <Input
                            name="text"
                            type="text"
                            placeholder="Enter your full name:"                            
                            onChange={({ target }) => setRegistration({ ...registration, displayName: target.value })}
                            required />
                    </FormControl>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title='Email must be in proper email form, i.e, email@emailprovider.com.'>
                                <InfoOutlinedIcon sx={{ color: 'text.secondary', height: '15px' }} />
                            </Tooltip>
                            Email:
                        </FormLabel>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter your email:"
                            onChange={({ target }) => setRegistration({ ...registration, email: target.value })}
                            required />
                    </FormControl>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title='Password must be equal to or greater than 8 characters.'>
                                <InfoOutlinedIcon sx={{ color: 'text.secondary', height: '15px' }} />
                            </Tooltip>
                            Password:
                        </FormLabel>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Enter a password:"
                            onChange={({ target }) => setRegistration({ ...registration, password: target.value })}
                            required />
                    </FormControl>   
                    {(!loading) ? (
                        <Button type="submit" sx={{ mt: 1, width: '100%' }}>Sign Up</Button>
                    ) : (
                        <Button
                        loading
                        loadingPosition="end"
                        endDecorator={<SendIcon />}
                        variant="solid"
                        sx={{ width: '100%' }}>
                            Sign Up
                        </Button>
                    )}
                </form>

                <Divider>or</Divider>
                    
                {(!loadingWithGoogle) ? (
                    <Button 
                        color="neutral"
                        variant="outlined" 
                        onClick={handleGoogleLogin}
                        startDecorator={<GoogleIcon />}>Sign up with Google</Button>
                ) : (
                    <Button 
                        loading
                        loadingPosition="end"
                        endDecorator={<SendIcon />}
                        variant="solid"
                        startDecorator={<GoogleIcon />}>Sign up with Google</Button>
                )}
                   
            </Sheet>
        </Container>
    </CssVarsProvider>
    );
}

export default SignUp;