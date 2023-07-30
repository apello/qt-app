import { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = (): JSX.Element => {
    return (
        <>
            <h3>Hello</h3>
            <button>
                <Link href='auth/login'>
                    Login
                </Link>
            </button>
        </>
    );
}

export default Home;