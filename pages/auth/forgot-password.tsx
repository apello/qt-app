import { auth } from "@/firebase/clientApp";
import { Alert, Box, Button, Container, CssVarsProvider, FormControl, FormLabel, Grid, IconButton, Input, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import NextLink from 'next/link';
import { FormEventHandler, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { sendPasswordResetEmail } from "firebase/auth";
import ModeToggle from "@/components/ModeToggle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const ForgotPassword: NextPage = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setOpenAlert(true);
                setLoading(false);
                setAlert('Password reset sent! Check your email for the next steps.');
            })
            .catch((error) => {
                setOpenAlert(true);
                setLoading(false);
                setAlert('Password is not correct! Please try again.');
                console.log(`Reauthentication failed: ${error}`);
            })        
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
                            {/* For smaller screens */}
                            <Typography level="h3" sx={{ display: {xs: 'none', sm: 'flex' } }}>Quran Tracker</Typography>
                            <Typography level="h3" sx={{ display: {xs: 'flex', sm: 'none' } }}>QT</Typography>
                        </LinkElement>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: 1 }}>
                        <LinkHolder>
                            <LinkElement href='/auth/login'>
                                <Typography>Go Back</Typography>
                            </LinkElement>
                        </LinkHolder>
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
                        Password Reset
                    </Typography>
                    <Typography level='body-md'>Enter your email to continue this action.</Typography> 
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel>Email:</FormLabel>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter email:"
                            onChange={({ target }) => setEmail(target.value)} 
                            required />
                    </FormControl>       
                    {(!loading) ? (
                        <Button type="submit" sx={{ mt: 1 }}>Reset Password</Button>
                    ) : (
                        <Button
                        loading
                        loadingPosition="end"
                        endDecorator={<SendIcon />}
                        variant="solid"
                        >
                            Reset Password
                        </Button>
                    )}
                    </form>
                </Sheet>
            </Container>
            
        </CssVarsProvider>
    );
}

export default ForgotPassword;