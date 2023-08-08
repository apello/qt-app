import ErrorPage from "@/components/ErrorPage";
import Header from "@/components/Header";
import LoadingPage from "@/components/LoadingPage";
import { auth } from "@/firebase/clientApp";
import { Alert, Card, Container, CssVarsProvider, Typography, Link, styled, Button, Tooltip, Box } from "@mui/joy";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from "react";
import IconButton from '@mui/joy/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Landing: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const { query : { status } } = useRouter();
    const [open, setOpen] = useState(true);

    const CardElement = styled(Card)(({
        textAlign: 'left',
        boxShadow: 'none',
        border: '1px solid #EAEAEA',
        '&:hover': {
          border: '1px solid #4D72F5',
        },
        width: '300px',
        margin: '20px',
        backgroundColor: 'white'
    }));

    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box>
                    <Header />
                    <Container sx={{ my: 3 }}>

                        {(status === 'new-user') ? (
                            <Alert 
                                variant="soft" 
                                sx={{ margin: '5px'}}
                                endDecorator={
                                    <IconButton 
                                        variant="plain" 
                                        size="sm" 
                                        color="neutral" 
                                        onClick={() => setOpen(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                }>
                                    Welcome to Quran Tracker App! Please verify your email using the link in your inbox!
                            </Alert>
                        ) : ( <></> )}

                        <Typography level='h1' sx={{ ml: 3, mt: 4, mb: 2 }}>Welcome, {user.displayName}</Typography>

                        <Box sx={{ display: 'flex' }}>
                            <CardElement>
                                <Typography level='title-lg'>Track Progress</Typography>
                                <Typography level='body-md'>Memorized a new verse? Revised a previous page? Track it here!</Typography>
                                <Button sx={{ mt: 2 }} variant="outlined">
                                    <NextLink href="progress/track-progress">
                                        <Link overlay>Track Progress</Link>
                                    </NextLink>
                                </Button>
                            </CardElement>

                            <CardElement>
                                <Typography level='title-lg'>See Progress</Typography>
                                <Typography level='body-md'>
                                    <Tooltip title='All Praise to God'>
                                        <Typography>Alhamdillulah</Typography>
                                    </Tooltip>, you have been working hard. To track your recent progress, click here.</Typography>
                                <Button sx={{ mt: 2 }} variant="outlined">
                                    <NextLink href="progress/view-recent-progress">
                                        <Link overlay>See Progress</Link>
                                    </NextLink>
                                </Button>
                            </CardElement>
                        </Box>
                    </Container>
                </Box>
            ) : ( 
                <Typography>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
}

export default Landing;