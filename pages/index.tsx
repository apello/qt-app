import ModeToggle from "@/components/ModeToggle";
import TwoSidedLayout from "@/components/TwoSidedLayout";
import { auth } from "@/firebase/clientApp";
import { Box, Button, Container, CssVarsProvider, Grid, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowForward from '@mui/icons-material/ArrowForward';

const Home: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);

    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.body : theme.palette.background.body,
        ...theme.typography["body-md"],
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
    }));

    const LinkElement = styled(Link)(({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    }));
    
    return (
        <CssVarsProvider>
            <Box sx={{ p: 3, boxSizing: 'border-box' }} >
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={6}>
                            <LinkElement href='/'>
                                <Typography level="h3">Quran Tracker</Typography>
                            </LinkElement>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}>
                        {(user) ? (
                            <LinkHolder>
                                <LinkElement href='/landing'>
                                    <Typography>Go Home</Typography>
                                </LinkElement>
                            </LinkHolder>
                        ) : (
                            <>
                                <LinkHolder>
                                    <LinkElement href='auth/login'>
                                        <Typography>Login</Typography> 
                                    </LinkElement>
                                </LinkHolder>
                                <LinkHolder>
                                    <LinkElement href='auth/signup'>
                                        <Typography>Sign Up</Typography>
                                    </LinkElement>
                                </LinkHolder>
                                <ModeToggle />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <TwoSidedLayout>
                <Typography color="primary" fontSize="lg" fontWeight="lg">
                    The power to do more
                </Typography>
                <Typography
                    level="h1"
                    fontWeight="xl"
                    fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
                >
                    A large headlinerer about our product features & services
                </Typography>
                <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
                    A descriptive secondary text placeholder. Use it to explain your business
                    offer better.
                </Typography>
                <Link href='/auth/signup'>
                    <Button size="lg" endDecorator={<ArrowForward />}>
                    Get Started
                    </Button>
                </Link>
                <Typography>
                    Already a member? <LinkElement href='/auth/login'>Sign in</LinkElement>
                </Typography>
            </TwoSidedLayout>

        </CssVarsProvider>
    );
}

export default Home;