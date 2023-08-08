'use client';

import { Box, CssVarsProvider, Grid, Sheet, Typography, styled } from "@mui/joy";
import { NextPage } from "next";
import Link from "next/link";
import ModeToggle from "./ModeToggle";

const AuthHeader = (): JSX.Element => {
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
        color: '#000',
        '&:hover': {
            textDecoration: 'underline',
        },
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
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row" }}>
                        <LinkHolder>
                                <LinkElement href='/auth/login'>
                                    <Typography>Login</Typography>
                                </LinkElement>
                        </LinkHolder>
                        <LinkHolder>
                                <LinkElement href='/auth/signup'>
                                    <Typography>Sign Up</Typography>
                                </LinkElement>
                        </LinkHolder>
                        <ModeToggle />
                    </Grid>
                </Grid>
            </Box>
        </CssVarsProvider>
    );
}

export default AuthHeader;