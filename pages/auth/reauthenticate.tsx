import { auth } from "@/firebase/clientApp";
import { Box, Button, CssVarsProvider, Dropdown, FormControl, FormLabel, Grid, Input, Link, ListDivider, Menu, MenuButton, MenuItem, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";
import { useAuthState, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import AuthHeader from "@/components/AuthHeader";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import ModeToggle from "@/components/ModeToggle";


// Add more restrictions to credentials
const Reauthenticate: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState("");

    const router = useRouter();
    // TODO: Test path in instances of it being undefined
    const { query : { path } } = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if(user) {
            const credentials = EmailAuthProvider.credential(
                user.email!,
                password
            );
            if(credentialsValid(credentials)) {
                reauthenticateWithCredential(user, credentials)
                    .then(() => {
                        router.push(path!.toString()+'?reauthenticate=true'); // Back to original page
                    })
                    .catch((error) => {
                        setMessage('Password is not correct! Please try again.');
                        console.log(`Reauthentication failed: ${error}`);
                    })
                
            }
        }
    }

    const LinkElement = styled(NextLink)(({
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#000',
        '&:hover': {
            textDecoration: 'underline',
        },
    }));

    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.body : theme.palette.background.body,
        ...theme.typography["body-md"],
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
    }));

    return (
        <CssVarsProvider>
            <Box sx={{ p: 3 }} >
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={6}>
                        <LinkElement href='/'>
                            <Typography level="h3">Quran Tracker
                            </Typography>
                        </LinkElement>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: 1 }}>
                        <LinkHolder>
                            <LinkElement href={path!.toString()}>
                                <Typography>Go Back</Typography>
                            </LinkElement>
                        </LinkHolder>
                        <ModeToggle />
                    </Grid>
                </Grid>
            </Box>
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
                    Reauthenticate
                </Typography>
                <Typography level='body-md'>Enter your password to continue this action.</Typography> 
                </div>

                <form onSubmit={(e) => handleSubmit(e)}>
                <FormControl sx={{ mb: 1 }}>
                    <FormLabel>Password:</FormLabel>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter password:"
                        onChange={({ target }) => setPassword(target.value)} 
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
                        Reauthenticate
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

export default Reauthenticate;