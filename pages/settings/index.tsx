import { auth, db, storage } from "@/firebase/clientApp";
import { User, onAuthStateChanged, sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { NextPage } from "next";
import NextLink from "next/link";
import { useState } from "react";
import { prettyPrintNormalDate } from '../../common/utils';
import Header from "@/components/Header";
import { parse } from "path";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Typography, Breadcrumbs, ButtonGroup, Link, Button, Table, Sheet, Avatar, Grid, Divider, Badge, Card, styled, Modal, ModalClose, Alert, IconButton, Tooltip } from "@mui/joy";
import EditIcon from '@mui/icons-material/Edit';
import Dropzone from "@/components/Dropzone";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const verifyEmail = () => {
        if(user) {
            sendEmailVerification(user)
                .then(() => {
                    setOpenAlert(true);
                    setAlert('Email verification successfully sent! Please check your email for the next steps.');
                })
                .catch((error) => {
                    setOpenAlert(true);
                    setAlert(`Error sending email verification: ${error}`);
                })
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
                            <Typography level='h1' sx={{ mb: 1 }}>Profile</Typography>
                        </Box>
                        
                        {/* Temporary Fix */}
                        <Box sx={{ display: {xs: 'inherit', sm: 'none'}}}>
                            <ButtonGroup 
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }} 
                                orientation='vertical'>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Profile</Typography>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/account'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Account</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/password'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Password</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/goals'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Goals</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ display: {xs: 'none', sm: 'inherit'}}}>
                            <ButtonGroup 
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }} 
                                orientation='horizontal'>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Profile</Typography>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/account'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Account</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/password'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Password</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button>
                                    <NextLink href='/settings/goals'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Goals</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                            </ButtonGroup>
                        </Box>
                       
                        <Card sx={{ 
                            display: 'flex', 
                            flexDirection: {xs: 'column', md: 'row' },
                            p: 3,
                            borderRadius: '10px', 
                            my: 2,
                            py: 4,
                            gap: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} 
                        variant='outlined'> 
                            <Box>
                                {(user.photoURL) ? (
                                    <Box onClick={() => setOpenModal(true)} sx={{ cursor: 'pointer' }}>
                                        <Badge
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeInset="14%"
                                            badgeContent={<EditIcon />}>
                                            <Avatar 
                                                src={user.photoURL} 
                                                sx={{ '--Avatar-size': {xs: '240px', md: '300px'} }}/>
                                        </Badge>
                                    </Box>
                                ) : ( 
                                    <Box onClick={() => setOpenModal(true)} sx={{ cursor: 'pointer' }}>
                                        <Badge
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeInset="14%"
                                            badgeContent={<EditIcon />}
                                            >
                                            <Avatar sx={{ 
                                                width: 'clamp(15rem, 1.3636rem + 2.1818vw, 30rem)',
                                                height: 'clamp(15rem, 1.3636rem + 2.1818vw, 30rem)',
                                                border: 1,
                                            }}/>

                                        </Badge>
                                     </Box>
                                )}

                                <Modal
                                    aria-labelledby="close-modal-title"
                                    open={openModal}
                                    onClose={() => { setOpenModal(false); }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Sheet
                                    variant="outlined"
                                    sx={{
                                        minWidth: 300,
                                        borderRadius: 'md',
                                        p: 3,
                                    }}
                                    >
                                        <ModalClose variant="outlined" />
                                        <Typography
                                            component="h2"
                                            id="close-modal-title"
                                            level="h4"
                                            textColor="inherit"
                                            fontWeight="lg"
                                            sx={{
                                                display: 'flex', 
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Tooltip title='Uploaded picture must be appropriate.'>
                                                <InfoOutlinedIcon sx={{ color: 'text.secondary', height: '15px' }} />
                                            </Tooltip>
                                            Change Profile Picture
                                        </Typography>
                                        <Dropzone user={user} />
                                    </Sheet>
                                </Modal>
                            </Box>
                            <Box>
                                <Typography level='h1' sx={{ mb: 1, fontSize: {xs: '2rem', sm: '2.5rem'} }}>{user.displayName}</Typography>
                                <Typography level='title-md' sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>
                                    Email: {user.email} - {(user.emailVerified) ? (
                                        <Typography>Verified</Typography> 
                                    ) : (
                                        <a style={{ 
                                            color: 'purple', 
                                            textDecoration: 'underline', 
                                            cursor: 'pointer' 
                                            }} 
                                            onClick={verifyEmail}>
                                            Not Verified
                                        </a>
                                    )}
                                </Typography>
                                <Typography level='title-md' sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Joined: {prettyPrintNormalDate(user.metadata.creationTime)}</Typography>
                                <Typography level='title-md' sx={{ fontSize: {xs: '.9rem', sm: '1rem'}}}>Last Sign In: {prettyPrintNormalDate(user.metadata.lastSignInTime)}</Typography>
                                <Button variant="outlined" color="neutral" sx={{ my: 2 }}>
                                    <NextLink href="/settings/account">
                                        <LinkElement overlay>
                                            <Typography level='body-sm'>Edit Account</Typography>
                                        </LinkElement>
                                    </NextLink>
                                </Button>
                            </Box>
                        </Card>
                          
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
            )}
        </CssVarsProvider>
    );
}


export default ViewProgress;