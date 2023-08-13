import ErrorPage from "@/components/ErrorPage";
import Header from "@/components/Header";
import LoadingPage from "@/components/LoadingPage";
import { auth } from "@/firebase/clientApp";
import { Alert, Card, Container, CssVarsProvider, Typography, Button, Tooltip, Box, CardActions, CardContent, Grid } from "@mui/joy";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from "react";
import IconButton from '@mui/joy/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Landing: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const { query : { status } } = useRouter();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(status === 'new-user'){
            setOpen(true);
        }
    },[status]);

    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box>
                    <Header />
                    <Container sx={{ my: 3 }}>
                        {(open) ? (
                            // Hide Alert
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

                        <Typography level='h1' sx={{ my: 4, fontSize: 'clamp(2rem, 0.7153rem + 1.6368vw, 4rem)'}}>Welcome, {user.displayName}</Typography>

                        <Grid container sx={{ gap: 2, p: 0, m: 0 }}>
                            <Grid xs={12} md={3}>
                                <Card variant="outlined" sx={{ height: '210px'}}>
                                    <CardContent>
                                        <Typography level="h4">Track Progress</Typography>
                                        <Typography level="body-sm">
                                        Memorized a new verse? Revised a previous page? Track it here!
                                        </Typography>
                                    </CardContent>
                                    <CardActions buttonFlex="0 1 200px">
                                        <NextLink href="/progress/track-progress">
                                            <Button variant="outlined" color="neutral">
                                                    <Typography level='body-sm'>Track Progress</Typography>
                                            </Button>
                                        </NextLink>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid xs={12} md={3}>
                                <Card variant="outlined" sx={{ height: '210px'}}>
                                    <CardContent>
                                        <Typography level="h4">View Progress</Typography>
                                        <Typography level="body-sm">
                                            <Tooltip title='All Praise to God'>
                                            <Typography>Alhamdillulah</Typography>
                                            </Tooltip>, you have been working hard. To view your recent or overall progress, click here.
                                        </Typography>
                                    </CardContent>
                                    <CardActions buttonFlex="0 1 200px">
                                        <NextLink href="/progress/view-recent-progress">
                                            <Button variant="outlined" color="neutral">
                                                    <Typography level='body-sm'>View Progress</Typography>
                                            </Button>
                                        </NextLink>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
            )}
        </CssVarsProvider>
    );
}

export default Landing;