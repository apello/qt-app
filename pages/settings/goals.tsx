import { auth } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Typography, Breadcrumbs, ButtonGroup, Link, Button, Card, Alert, IconButton } from "@mui/joy";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


const Goals: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
       
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
                            <Typography level='h1' sx={{ mb: 1 }}>Goals</Typography>
                        </Box>
                        
                        <Box sx={{ display: {xs: 'inherit', sm: 'none'}}}>
                            <ButtonGroup 
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
                                orientation="vertical">
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
                                <Button>
                                    <NextLink href='/settings/password'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Password</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Goals</Typography>
                                </Button>
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ display: {xs: 'none', sm: 'inherit'}}}>
                            <ButtonGroup 
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
                                orientation="horizontal">
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
                                <Button>
                                    <NextLink href='/settings/password'>
                                        <Link overlay>
                                            <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Password</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography sx={{ fontSize: {xs: '.9rem', md: '1rem'}}}>Goals</Typography>
                                </Button>
                            </ButtonGroup>
                        </Box>
                       
                        <Card sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            textAlign: 'center',
                            py: 10,
                            px: 3
                        }} 
                        variant='outlined'> 
                            <Typography level="title-md">This page is under-construction 🚧. Coming soon, ان شاء الله!</Typography>
                        </Card>
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
            )}
        </CssVarsProvider>
    );
}


export default Goals;