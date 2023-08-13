'use client';

import { CssVarsProvider, Typography } from "@mui/joy";

const LoadingPage = () => {
    // TODO: Add animation
    return (
        <CssVarsProvider>
            <Typography sx={{ m: 3 }}>Loading...</Typography>
        </CssVarsProvider>
    );
};

export default LoadingPage;