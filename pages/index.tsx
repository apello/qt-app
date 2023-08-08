import { auth } from "@/firebase/clientApp";
import { Box, Container, CssVarsProvider, Grid, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);

    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
        ...theme.typography["body-md"],
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
        textDecoration: 'none',
        cursor: 'pointer'
    }));

    const LinkElement = styled(Link)(({
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#000'
    }));
    

    return (
        <CssVarsProvider>
            <Box sx={{ p: 2 }} >
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={6}>
                        <Typography level="h3">
                            <LinkElement href='/'>Quran Tracker</LinkElement>
                        </Typography>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}>
                        {(user) ? (
                            <LinkHolder>
                                <Typography>
                                    <LinkElement href='/landing'>Go Home</LinkElement>
                                </Typography>
                            </LinkHolder>
                        ) : (
                            <>
                                <LinkHolder>
                                    <Typography>
                                        <LinkElement href='auth/login'>Login</LinkElement>
                                    </Typography>
                                </LinkHolder>
                                <LinkHolder>
                                    <Typography>
                                        <LinkElement href='auth/signup'>Sign Up</LinkElement>
                                    </Typography>
                                </LinkHolder>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </CssVarsProvider>
    );
}

export default Home;