'use client';

import { useColorScheme, Button } from "@mui/joy";

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

const ModeToggle = () => {
    const { mode, setMode } = useColorScheme();
    return (
        <Button
        variant="outlined"
        color="neutral"
        sx={{ borderRadius: '20px', ml: 1 }}
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
            {mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon /> }
        </Button>
    );
      
}

export default ModeToggle;