'use client';

import { Box, CssVarsProvider, Dropdown, Grid, ListDivider, Menu, MenuButton, MenuItem, Sheet, Typography, styled, Link } from "@mui/joy";
import NextLink from "next/link";
import ModeToggle from "./ModeToggle";
import MenuIcon from '@mui/icons-material/Menu';

const AuthHeader = (): JSX.Element => {
    const LinkHolder = styled(Sheet)(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.body : theme.palette.background.body,
        ...theme.typography["body-md"],
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.vars.palette.text.secondary,
    }));

    const LinkElement = styled(NextLink)(({
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
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: 1 }}>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }}}>
                            <Dropdown>
                                <MenuButton size="sm">
                                    <MenuIcon />
                                </MenuButton>
                                <Menu size="md">
                                    <MenuItem>
                                        <LinkElement href='/auth/login'>
                                            <Link overlay>Login</Link>
                                        </LinkElement>
                                    </MenuItem>
                                    <ListDivider />
                                    <MenuItem>
                                        <LinkElement href='/auth/signup'>
                                            <Link overlay>Sign up</Link>
                                        </LinkElement>
                                    </MenuItem>
                                </Menu>
                            </Dropdown>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }}}>
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
                        </Box>
                        <ModeToggle />
                    </Grid>
                </Grid>
            </Box>
        </CssVarsProvider>
    );
}

export default AuthHeader;