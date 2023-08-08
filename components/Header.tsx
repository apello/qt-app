'use client';

import { auth } from "@/firebase/clientApp";
import { Box, Grid, Sheet, Typography, styled } from "@mui/joy";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";

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

    const LinkElement = styled(Link)(({
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#000',
    }));

    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
        ...theme.typography["body-md"],
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
        cursor: 'pointer'
    }));

    return (
        <Box sx={{ p: 2, borderBottom: '1px solid #aeaeae' }} >
            <Grid container spacing={2} sx={{ flexGrow: 1, px: 3 }}>
                <Grid xs={6}>
                    <Typography level="h3">
                        <LinkElement href='/landing'>Quran Tracker</LinkElement>
                    </Typography>
                </Grid>
                <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}>
                    <LinkHolder>
                        <Typography>
                            <LinkElement href='/landing'>Home</LinkElement>
                        </Typography>
                    </LinkHolder>
                    <LinkHolder>
                        <Typography>
                            <LinkElement href='' onClick={handleSignOut}>Sign Out</LinkElement>
                        </Typography>
                    </LinkHolder>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Header;