'use client';

import { CssVarsProvider, Link, Typography } from "@mui/joy";

const ErrorPage = () => {
    return (
        <CssVarsProvider>
            <Typography sx={{ m: 3 }}>Something went wrong. <Link href='/'>Return home.</Link></Typography>
        </CssVarsProvider>
    );
};

export default ErrorPage;