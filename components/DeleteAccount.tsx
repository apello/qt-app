"use client";

import { auth } from "@/firebase/clientApp";
import { Alert, Box, Button, Container, CssVarsProvider, FormControl, FormLabel, Grid, IconButton, Input, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import { EmailAuthProvider, User, reauthenticateWithCredential } from "firebase/auth";
import ModeToggle from "@/components/ModeToggle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Add more restrictions to credentials
// const Reauthenticate: React.FC<{ 
//     user: User,
//     loading: boolean,
//     setOpenAlert: (_:boolean) => void, 
//     setAlert: (_:string) => void,
//     showPrompt: boolean,
//     setShowPrompt: (_:boolean) => void
// }> = ({ setOpenAlert, setAlert, user, loading, showPrompt, setShowPrompt }) => {
//     const [password, setPassword] = useState('');

//     const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
//         e.preventDefault();

//         if(user) {
//             const credentials = EmailAuthProvider.credential(
//                 user.email!,
//                 password
//             );
//             if(credentialsValid(credentials)) {
//                 reauthenticateWithCredential(user, credentials)
//                     .then(() => {
//                         setShowPrompt(true);
//                     })
//                     .catch((error) => {
//                         setOpenAlert(true);
//                         setAlert('Password is not correct! Please try again.');
//                         console.log(`Reauthentication failed: ${error}`);
//                     })
//             }
//         }
//     }

//     return (
//         <Box>
//             {(!showPrompt) ? (
//                 <Sheet 
//                     sx={{
//                         width: 300,
//                         mx: 'auto',
//                         my: 2,
//                         py: 3,
//                         px: 2,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: 2,
//                         border: '1px solid #aeaeae',
//                         borderRadius: 'sm'
//                     }}>
//                     <div>
//                     <Typography level="h3" component="h1">
//                         Reauthenticate
//                     </Typography>
//                     <Typography level='body-md'>Enter your password to continue this action.</Typography> 
//                     </div>

//                     <form onSubmit={(e) => handleSubmit(e)}>
//                     <FormControl sx={{ mb: 1 }}>
//                         <FormLabel>Password:</FormLabel>
//                         <Input
//                             name="password"
//                             type="password"
//                             placeholder="Enter password:"
//                             onChange={({ target }) => setPassword(target.value)} 
//                             required />
//                     </FormControl>       
//                     {(!loading) ? (
//                         <Button type="submit" sx={{ mt: 1 }}>Reauthenticate</Button>
//                     ) : (
//                         <Button
//                         loading
//                         loadingPosition="end"
//                         endDecorator={<SendIcon />}
//                         variant="solid"
//                         >
//                             Reauthenticate
//                         </Button>
//                     )}
//                     </form>
//                 </Sheet>
//             ) : ( <></> )}
//         </Box>
//     );
// }

// const Prompt: React.FC<{ 
//     user: User,
//     loading: boolean,
//     setOpenAlert: (_:boolean) => void, 
//     setAlert: (_:string) => void,
//     showPrompt: boolean,
//     setShowPrompt: (_:boolean) => void
// }> = ({ setOpenAlert, setAlert, user, loading, showPrompt, setShowPrompt }) => {
//     const [verification, setVerification] = useState('');

//     const handleDeleteAccount: FormEventHandler<HTMLFormElement> = async (e) => {
//         e.preventDefault();

//         // Delete account and remove profile picture
//         if(user) {
            
//         }
//     }

//     return (
//         <Box>
//             {(showPrompt) ? (
//                 <Box sx={{ display: 'flex', flexDirection: 'column',  gap: 2, maxWidth: '400px'}}>
//                     <Alert sx={{ mt: 2 }} color="danger" variant="outlined">Are you sure you want to do this?</Alert>
//                     <Typography>We will immediately delete all of your information, including your progress logs. This action cannot be reversed.</Typography>

//                     <form onSubmit={handleDeleteAccount}>
//                         <FormControl>
//                             <FormLabel>
//                                 <Typography>To verify, type &nbsp;<b>delete my account</b>&nbsp; below: </Typography>
//                             </FormLabel>
//                             <Input 
//                                 type="text"
//                                 value={verification}
//                                 placeholder="Type response here: "
//                                 onChange={({ target }) => setVerification(target.value)} />
//                         </FormControl>
                        

//                         <Button 
//                             type="submit"
//                             variant="outlined"
//                             color="danger"
//                             disabled={verification.toLowerCase() !== "delete my account"}
//                             sx={{ mt: 2}}>Delete my account</Button>
//                     </form>
//                 </Box>
//             ) : ( <></> )}
//         </Box>
//     );
// }


const DeleteAccount: React.FC<{ user: User, loading: boolean }> = ({ user, loading }) => {
    // const [alert, setAlert] = useState('');
    // const [openAlert, setOpenAlert] = useState(false);


    // const [showPrompt, setShowPrompt] = useState(false);

    return (
        <Box>
            {/* {(openAlert) ? (
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

            <Reauthenticate
                user={user}
                loading={loading}
                setOpenAlert={setOpenAlert}
                setAlert={setAlert}
                showPrompt={showPrompt}
                setShowPrompt={setShowPrompt} />

            <Prompt
                user={user}
                loading={loading}
                setOpenAlert={setOpenAlert}
                setAlert={setAlert}
                showPrompt={showPrompt}
                setShowPrompt={setShowPrompt} />

             */}

             <Typography sx={{ py: 2}}>Delete account functionality coming soon!</Typography>

        </Box>
    );
};

export default DeleteAccount;