'use client';

import { Box, CssVarsProvider, Dropdown, Grid, ListDivider, Menu, MenuButton, MenuItem, Sheet, Typography, styled } from "@mui/joy";
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
                            {/* For smaller screens */}
                            <Typography level="h3" sx={{ display: {xs: 'none', sm: 'flex' } }}>Quran Tracker</Typography>
                            <Typography level="h3" sx={{ display: {xs: 'flex', sm: 'none' } }}>QT</Typography>
                        </LinkElement>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: 1 }}>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }}}>
                            <Dropdown>
                                <MenuButton size="sm">
                                    <MenuIcon />
                                </MenuButton>
                                <Menu size="md">
                                    <LinkElement href='/auth/login'>
                                        <MenuItem>
                                            Login
                                        </MenuItem>
                                    </LinkElement>
                                    <ListDivider />
                                    <LinkElement href='/auth/signup'>
                                        <MenuItem>
                                            Sign up
                                        </MenuItem>
                                    </LinkElement>

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