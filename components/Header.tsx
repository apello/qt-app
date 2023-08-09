'use client';

import { auth } from "@/firebase/clientApp";
import { Box, Button, Grid, Sheet, Typography, styled, useColorScheme } from "@mui/joy";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import ModeToggle from "./ModeToggle";

const Header = (): JSX.Element => {
    const router = useRouter();
    const handleSignOut = () => {        
        signOut(auth)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(`Error with signing user out: ${error}`);
            })
    };

    const LinkElement = styled(Link)(({ theme }) => ({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    }));

    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor: theme.palette.background.body,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
    }));

    const Header = styled(Box)(({ theme }) => ({
        backgroundColor: theme.palette.background.body,
        ...theme.typography["body-md"],
    }));

    return (
        <Header sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ flexGrow: 1, }}>
                <Grid xs={6}>
                    <LinkElement href='/landing'>
                        <Typography level="h3">Quran Tracker</Typography>
                    </LinkElement>
                </Grid>
                <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}>
                    <LinkHolder>
                            <LinkElement href='/landing'>
                                <Typography>Home</Typography>
                            </LinkElement>
                    </LinkHolder>
                    <LinkHolder>
                        <LinkElement href='' onClick={handleSignOut}>
                            <Typography>Sign out</Typography>
                        </LinkElement>
                    </LinkHolder>
                    <ModeToggle />
                </Grid>
            </Grid>
        </Header>
    );
}

export default Header;