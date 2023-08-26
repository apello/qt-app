import ModeToggle from "@/components/ModeToggle";
import TwoSidedLayout from "@/components/TwoSidedLayout";
import { auth } from "@/firebase/clientApp";
import { Box, Button, Container, CssVarsProvider, Dropdown, Grid, ListDivider, Menu, MenuButton, MenuItem, Sheet, Typography, styled, Link } from "@mui/joy";
import { NextPage } from "next";
import NextLink from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowForward from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';

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

    const LinkElement = styled(NextLink)(({
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
                            {/* For smaller screens */}
                            <Typography level="h3" sx={{ display: {xs: 'none', sm: 'flex' } }}>Quran Tracker</Typography>
                            <Typography level="h3" sx={{ display: {xs: 'flex', sm: 'none' } }}>QT</Typography>
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
                            </>
                        )}
                        <ModeToggle />
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
                <NextLink href='/auth/signup'>
                    <Button size="lg" endDecorator={<ArrowForward />}>
                    Get Started
                    </Button>
                </NextLink>
                <Typography>
                    Already a user? <LinkElement href='/auth/login'>Sign in</LinkElement>
                </Typography>
            </TwoSidedLayout>

        </CssVarsProvider>
    );
}

export default Home;