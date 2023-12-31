import { auth } from "@/firebase/clientApp";
import { Alert, Box, Button, Container, CssVarsProvider, FormControl, FormLabel, Grid, IconButton, Input, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';
import { credentialsValid } from "@/common/utils";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import ModeToggle from "@/components/ModeToggle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Add more restrictions to credentials
const Reauthenticate: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

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
                        setOpenAlert(true);
                        setAlert('Password is not correct! Please try again.');
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
                        <LinkElement href='/landing'>
                            {/* For smaller screens */}
                            <Typography level="h3" sx={{ display: {xs: 'none', sm: 'flex' } }}>Quran Tracker</Typography>
                            <Typography level="h3" sx={{ display: {xs: 'flex', sm: 'none' } }}>QT</Typography>
                        </LinkElement>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: 1 }}>
                        {(path) ? (
                            <LinkHolder>
                                <LinkElement href={path!.toString()}>
                                    <Typography>Go Back</Typography>
                                </LinkElement>
                            </LinkHolder>
                        ) : ( <></> )}
                        <ModeToggle />
                    </Grid>
                </Grid>
            </Box>
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
                        <Button type="submit" sx={{ mt: 1 }}>Reauthenticate</Button>
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
                </Sheet>
            </Container>
            
        </CssVarsProvider>
    );
}

export default Reauthenticate;