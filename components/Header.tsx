import { auth } from "@/firebase/clientApp";
import { Box, Button, Dropdown, Grid, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem, Sheet, Typography, styled, Link, Avatar } from "@mui/joy";
import { signOut } from "firebase/auth";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ModeToggle from "./ModeToggle";
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthState } from "react-firebase-hooks/auth";

const Header = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
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

    const LinkElement = styled(NextLink)(({ theme }) => ({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
        color: theme.vars.palette.text.primary
    }));

    const Header = styled(Box)(({ theme }) => ({
        backgroundColor: theme.palette.background.body,
        ...theme.typography["body-md"],
    }));

    return (
        <Header sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                <Grid xs={6}>
                    <LinkElement href='/landing'>
                        {/* For smaller screens */}
                        <Typography level="h3" sx={{ display: {xs: 'none', sm: 'flex' } }}>Quran Tracker</Typography>
                        <Typography level="h3" sx={{ display: {xs: 'flex', sm: 'none' } }}>QT</Typography>
                    </LinkElement>
                </Grid>
                <Grid xs={6} sx={{ display: "flex", justifyContent: "right", flexDirection: "row", gap: {xs: 0, md: 1} }}>
                    <Dropdown>
                        <MenuButton size="sm">
                            <MenuIcon />
                        </MenuButton>
                        <Menu size="md" placement="bottom-end">
                            <MenuItem>
                                <LinkElement href='/landing'>
                                    <Link overlay>Home</Link>
                                </LinkElement>
                            </MenuItem>
                            <ListDivider />
                            <MenuItem>
                                <LinkElement href='/progress/track-progress'>
                                    <Link overlay>Track Progress</Link>
                                </LinkElement>
                            </MenuItem>
                            <MenuItem>
                                <LinkElement href='/progress/view-recent-progress'>
                                    <Link overlay>View Progress</Link>
                                </LinkElement>
                            </MenuItem>
                            <ListDivider />
                            <MenuItem>
                                <LinkElement href='mailto:abdelrahmanmuhiyadiin@gmail.com'>
                                    <Link overlay>Contact</Link>
                                </LinkElement>
                            </MenuItem>
                            <ListDivider />
                            <MenuItem>
                                <LinkElement href='' onClick={handleSignOut}>
                                    <Link overlay>Sign out</Link>
                                </LinkElement>
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                    <ModeToggle />
                    <NextLink href='/settings'>
                        {(user?.photoURL) ? (
                            <Avatar 
                                src={user.photoURL} 
                                sx={{ ml: 1, border: 1, borderColor: 'neutral.outlinedBorder' }}/>
                        ) : ( 
                            <Avatar sx={{ ml: 1, border: 1, borderColor: 'neutral.outlinedBorder' }}/>
                        )}
                    </NextLink>
                </Grid>
            </Grid>
        </Header>
    );
}

export default Header;