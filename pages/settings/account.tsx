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
import { updateProfile, updateEmail } from "firebase/auth";
import SendIcon from '@mui/icons-material/Send';
import { useRouter } from "next/router";

const EditAccount: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [credentials, setCredentials] = useState({ displayName: '', email: ''});
    const [loadingUpdateName, setLoadingUpdateName] = useState(false);
    const [loadingUpdateEmail, setLoadingUpdateEmail] = useState(false);
    const router = useRouter();

    const { query : { reauthenticate } } = useRouter();

    useEffect(() => {
        if(reauthenticate === 'true') {
            setOpenAlert(true);
            setAlert('Successfully reauthenticated your session. You can now make your changes.');
        }
    },[reauthenticate]);

    const handleDisplayNameUpdate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if(user !== null && user !== undefined) {
            setLoadingUpdateName(true);
            updateProfile(user, {
                displayName: (credentials.displayName !== '') ? credentials.displayName : user.displayName,
            })
            .then(() => {
                setLoadingUpdateName(false);
                setOpenAlert(true);
                setAlert('Successfully updated user display name!');
            })
            .catch((error) => {
                setLoadingUpdateName(false);
                setOpenAlert(true);
                setAlert(`Error updating display name: ${error}`);
            });
        }
    };

    const handleEmailUpdate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if(user !== null && user !== undefined) {
            setLoadingUpdateEmail(true);
            updateEmail(user, (credentials.email !== '') ? credentials.email! : user.email!)
            .then(() => {
                setLoadingUpdateEmail(false);
                setOpenAlert(true);
                setAlert('Successfully updated email!');
            })
            .catch((error) => {
                setLoadingUpdateEmail(false);
                if(error.code === 'auth/requires-recent-login') {
                    router.push('/auth/reauthenticate?path=/settings/account');
                } else {
                    setOpenAlert(true);
                    setAlert(`Error updating user account information: ${error}`);
                }
            });
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
                            <Typography level='h1' sx={{ mb: 1 }}>Account</Typography>
                        </Box>
                        
                        <ButtonGroup sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button>
                                <NextLink href='/settings/'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Profile</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button variant='soft' sx={{ cursor: 'default' }}>
                                <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Account</Typography>
                            </Button>
                            <Button>
                                <NextLink href='/settings/password'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Password</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button>
                                <NextLink href='/settings/goals'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Goals</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </ButtonGroup>
                       
                        <Typography level="h3">Edit Account Information:</Typography>

                        <Card sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 2,
                            px: 6,
                            borderRadius: '10px', 
                            my: 2,
                            py: 4,
                        }} 
                        variant='outlined'> 
                            <Typography level="h4">Edit Display Name:</Typography>
                            <FormControl>
                                <FormLabel>Full Name:</FormLabel>
                                <Input 
                                    type='text'
                                    value={credentials.displayName}
                                    onChange={(e) => setCredentials({...credentials, displayName: e.target.value})} />
                            </FormControl>       
                            
                            {(!loadingUpdateName) ? (
                                <Button
                                    onClick={(e) => handleDisplayNameUpdate(e)}
                                    disabled={credentials.displayName === '' && credentials.email === ''}
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
                        </Card>

                        <Card sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 2,
                            px: 6,
                            borderRadius: '10px', 
                            my: 2,
                            py: 4,
                        }} 
                        variant='outlined'> 
                            <Typography level="h4">Edit Email:</Typography>      
                            <FormControl>
                                <FormLabel>Email:</FormLabel>
                                <Input 
                                    type='email'
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
                            </FormControl> 

                            {(!loadingUpdateEmail) ? (
                                <Button
                                    onClick={(e) => handleEmailUpdate(e)}
                                    disabled={credentials.displayName === '' && credentials.email === ''}
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
                        </Card>
                          
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
}


export default EditAccount;