import { auth, db, storage } from "@/firebase/clientApp";
import { User, onAuthStateChanged, sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { NextPage } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized, prettyPrintNormalDate } from '../../common/utils';
import Header from "@/components/Header";
import { parse } from "path";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Typography, Breadcrumbs, ButtonGroup, Link, Button, Table, Sheet, Avatar, Grid, Divider, Badge, Card, styled, Modal, ModalClose } from "@mui/joy";
import EditIcon from '@mui/icons-material/Edit';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Dropzone from "@/components/Dropzone";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState('');
    const [file, setFile] = useState<Blob | null>();
    const [openModal, setOpenModal] = useState(false);

    // const verifyEmail = () => {
    //     if(user !== undefined && user !== null) {
    //         sendEmailVerification(user)
    //             .then(() => {
    //                 setAlert('Email verification successfully sent! Please check your email for the next steps.');
    //             })
    //             .catch((error) => {
    //                 setAlert(`Error sending email verification: ${error}`);
    //             })
    //     }
    // };

    console.log(file)

    const handlePhotoUrl = async () => {
        if(user && file) {
            await uploadBytes(ref(storage, `${user.uid}.png`), file)
                .then(() => {
                    getDownloadURL(ref(storage, `${user.uid}.png`))
                        .then((photoURL) => {
                            updateProfile(user, { 
                                displayName: user.displayName,
                                photoURL: photoURL
                            })
                                .catch((error) => {
                                    console.log(`Could not set photo URL: ${error}`)
                                })
                        })  
                        .catch((error) => {
                            console.log(`Download failed: ${error}`)
                        })
                })
                .catch((error) => {
                    console.log(`Upload failed: ${error}`)
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
                        <Box sx={{ mb: 2 }}>
                            <Breadcrumbs sx={{ px: 0 }}>
                                <Typography level='title-sm'>
                                    <NextLink href="/landing">Home</NextLink>
                                </Typography>
                                <Typography level='title-sm'>Settings</Typography>
                            </Breadcrumbs>
                            <Typography level='h1' sx={{ mb: 1 }}>Profile</Typography>
                        </Box>
                        
                        <ButtonGroup sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button variant='soft' sx={{ cursor: 'default' }}>
                                <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Profile</Typography>
                            </Button>
                            <Button>
                                <NextLink href='settings/account'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Account</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button>
                                <NextLink href='settings/password'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Password</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button>
                                <NextLink href='settings/goals'>
                                    <Link overlay>
                                        <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Goals</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </ButtonGroup>

                       
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
                                                sx={{ '--Avatar-size': '288px' }}/>
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
                                                width: 'clamp(18rem, 1.3636rem + 2.1818vw, 30rem)',
                                                height: 'clamp(18rem, 1.3636rem + 2.1818vw, 30rem)',
                                                border: 1,
                                            }}/>

                                        </Badge>
                                        {/* <input type='file' onChange={(e) => setFile((e.target.files) ? e.target.files[0] : null )} />
                                        <input type='submit' onClick={handlePhotoUrl} /> */}
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
                                        >
                                            Change Profile Picture
                                        </Typography>
                                        <Dropzone user={user} />
                                    </Sheet>
                                </Modal>
                            </Box>
                            <Box>
                                <Typography level='h1' sx={{ mb: 1 }}>{user.displayName}</Typography>
                                <Typography level='title-md'>
                                    Email: {user.email} - {(user.emailVerified) ? <Typography>Verified</Typography>  : <Typography>Not Verified</Typography>}
                                    {/* : <a style={{ color: 'purple', textDecoration: 'underline', cursor: 'pointer' }} onClick={verifyEmail}>Not Verified</a>} */}
                                </Typography>
                                <Typography level='title-md'>Joined: {prettyPrintNormalDate(user.metadata.creationTime)}</Typography>
                                <Typography level='title-md'>Last Sign In: {prettyPrintNormalDate(user.metadata.lastSignInTime)}</Typography>
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
                <Typography sx={{ p: 2 }}>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
}


export default ViewProgress;