import { auth, db, storage } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { prettyPrintNormalDate } from '../../common/utils';
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Typography, Breadcrumbs, ButtonGroup, Link, Button, Table, Sheet, Avatar, Grid, Divider, Badge, Card, styled, Modal, ModalClose, Alert, IconButton, FormControl, FormLabel, Input } from "@mui/joy";
import EditIcon from '@mui/icons-material/Edit';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import SendIcon from '@mui/icons-material/Send';
import { useRouter } from "next/router";

const ChangePassword: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [passwords, setPasswords] = useState({ password: '', reEnterPassword: ''});
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const router = useRouter();

    const { query : { reauthenticate } } = useRouter();

    useEffect(() => {
        if(reauthenticate === 'true') {
            setOpenAlert(true);
            setAlert('Successfully reauthenticated your session. You can now make your changes.');
        }
    },[reauthenticate]);

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if((user !== null && user !== undefined)) {
            if(passwords.password !== passwords.reEnterPassword) {
                setOpenAlert(true);
                setAlert('Passwords do not match! Please try again.');
            } else if(passwords.password.length >= 8) {
                setOpenAlert(true);
                setAlert('Password must be greater than 8 characters. Please try again.');
            } else {
                setLoadingUpdate(true);
                updatePassword(user, passwords.password)
                    .then(() => {
                        setLoadingUpdate(false);
                        setOpenAlert(true);
                        setAlert('Successfully updated password!');
                    })
                    .catch((error) => {
                        setLoadingUpdate(false);
                        if(error.code === 'auth/requires-recent-login') {
                            router.push('/auth/reauthenticate?path=/settings/password');
                        } else {
                            setOpenAlert(true);
                            setAlert(`Error updating user account information: ${error}`);
                        }
                    });
            }
        }
    };

    const LinkElement = styled(Link)(({
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#000',
    }));

       
    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box> 
                    <Header />
                    <Container sx={{ mt: 3, mb: 5 }}>
                    {(openAlert) ? (
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
                        <Box sx={{ mb: 2 }}>
                            <Breadcrumbs sx={{ px: 0 }}>
                                <Typography level='title-sm'>
                                    <NextLink href="/landing">Home</NextLink>
                                </Typography>
                                <Typography level='title-sm'>Settings</Typography>
                            </Breadcrumbs>
                            <Typography level='h1' sx={{ mb: 1 }}>Password</Typography>
                        </Box>
                        
                        <ButtonGroup sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button>
                                <NextLink href='/settings/'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Profile</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button>
                                <NextLink href='/settings/account'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Account</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button variant='soft' sx={{ cursor: 'default' }}>
                                <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Password</Typography>
                            </Button>
                            <Button>
                                <NextLink href='/settings/goals'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Goals</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </ButtonGroup>
                       
                        <Card sx={{ 
                                px: 6,
                                borderRadius: '10px', 
                                my: 2,
                                py: 4
                            }} 
                            variant='outlined'> 

                            <Typography level="h3">Change Password:</Typography>
                            <form 
                                onSubmit={(e) => handleChangePassword(e)}
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: '15px'
                                 }}>
                                <FormControl>
                                    <FormLabel>Enter Password:</FormLabel>
                                    <Input 
                                        type='password'
                                        value={passwords.password}
                                        onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                                        required />
                                </FormControl>       
                                <FormControl>
                                    <FormLabel>Re-enter Password:</FormLabel>
                                    <Input 
                                        type='password'
                                        value={passwords.reEnterPassword}
                                        onChange={(e) => setPasswords({...passwords, reEnterPassword: e.target.value})}
                                        required />
                                </FormControl> 

                                {(!loadingUpdate) ? (
                                    <Button
                                        type='submit'
                                        disabled={passwords.password === '' && passwords.reEnterPassword === ''}
                                        variant='outlined'
                                        color='neutral'
                                        sx={{ display: 'inherit', alignSelf: 'flex-end', width: '200px'}}>
                                        Save Changes
                                    </Button>  
                                ) : (
                                    <Button
                                        loading
                                        loadingPosition="end"
                                        endDecorator={<SendIcon />}
                                        variant="solid"
                                        color='neutral'
                                        sx={{ display: 'inherit', alignSelf: 'flex-end', width: '200px'}}>
                                        Save Changes
                                    </Button>  
                                )}
                            </form>                            
                        </Card>
                          
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
}


export default ChangePassword;