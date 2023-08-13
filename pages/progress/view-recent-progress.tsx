import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { ProgressLog, prettyPrintDate } from '../../common/utils';
import { DocumentData, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Typography, Breadcrumbs, ButtonGroup, Link, Button, Table, Sheet } from "@mui/joy";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth); // User data
    const [logs, setLogs] = useState<Array<DocumentData>>(); // Logs from db

    // Define these
    const [memorizationLogs, setMemorizationLogs] = useState<any>(); 
    const [revisionLogs, setRevisionLogs] = useState<any>();

    // Download the logs from the db in DocumentData[] type
    useEffect(() => {
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user) {
                getDocs(query(collection(db, `data/${user!.uid}`, 'log'), limit(15), orderBy('createdAt', 'desc')))
                .then((logs) => {
                    logs.docs.map((doc) => arr.push({data: doc.data(), id: doc.id}))
                    // logs.docs.map((doc) => arr.push(doc.data()))
                    setLogs(arr);
                })
                .catch((error) => {
                    console.log(`Error downloading logs: ${error}`);
                })
            }
        };

        downloadProgressLogs();
    },[user]);

    // Process data and separate it into reading types
    useEffect(() => {
        if(logs) {
            const parsedLogs = JSON.parse(JSON.stringify(logs));
            setMemorizationLogs(
                parsedLogs!.filter((log: ProgressLog) => log.data.readingType === 'Memorization')
            );
            setRevisionLogs(
                parsedLogs!.filter((log: ProgressLog) => log.data.readingType === 'Revision')
            );
        }
    },[logs, setMemorizationLogs, setRevisionLogs]);
       
    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box>
                    <Header />
                    <Container sx={{ mt: 3, mb: 5 }}>
                        <Box sx={{ mb: 2 }}>
                            <Breadcrumbs sx={{ px: 0 }}>
                                <Typography level='title-sm'>
                                    <NextLink href="/landing">Home</NextLink>
                                </Typography>
                                <Typography level='title-sm'>View Progress</Typography>
                            </Breadcrumbs>
                            <Typography level='h1' sx={{ mb: 1 }}>Recent Progress</Typography>
                            <Typography level='title-sm'>
                            View the last 15 logs you memorized/revised.                            
                            </Typography>
                        </Box>
                        
                        <ButtonGroup sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button variant='soft' sx={{ cursor: 'default' }}>
                                <Typography>Recent Progress</Typography>
                            </Button>
                            <Button>
                                <NextLink href='/progress/view-all-progress'>
                                    <Link overlay>
                                        <Typography>All Progress</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </ButtonGroup>

                        <RecentProgressTable
                            memorizationLogs={memorizationLogs}
                            revisionLogs={revisionLogs} />
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
            )}
        </CssVarsProvider>
    );
}


const RecentProgressTable: React.FC<{ memorizationLogs: any, revisionLogs: any }> = ({ memorizationLogs, revisionLogs }) => {
    return (
        <Box>
            {(memorizationLogs !== undefined) ? (
                <Sheet sx={{ p: 3, borderRadius: '10px', my: 2 }} variant='outlined'> 
                    <Typography level="h4">Memorization</Typography>
                    <Table sx={{ my: 2 }} borderAxis='bothBetween'>
                        {(memorizationLogs!.length > 0) ? (
                            <>
                                <thead>
                                    <tr>
                                        <th>Chapter Name</th>
                                        <th>Amount Completed</th>
                                        <th>Verse Range</th>
                                        <th>Log Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memorizationLogs.map((log: ProgressLog) => (
                                        <tr key={log.id}>
                                            <td>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                            <td>{log.data.verseAmount} verses</td>
                                            <td>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                            <td>{prettyPrintDate(log.data.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : ( 
                            <Box sx={{ p:2, textAlign: 'center' }}>
                                <Typography>No recent memorization logs.</Typography>
                            </Box>
                        )}
                    </Table>
                </Sheet>
            ) : ( <Typography sx={{ p: 2 }}>Loading...</Typography> )}  

            {(revisionLogs !== undefined) ? (
                <Sheet sx={{ p: 3, borderRadius: '10px', my: 2 }} variant='outlined'> 
                    <Typography level="h4">Revision</Typography>
                    <Table sx={{ my: 2 }} borderAxis='bothBetween'>
                        {(revisionLogs!.length > 0) ? (
                            <>
                                <thead>
                                    <tr>
                                        <th>Chapter Name</th>
                                        <th>Amount Completed</th>
                                        <th>Verse Range</th>
                                        <th>Log Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revisionLogs.map((log: ProgressLog) => (
                                        <tr key={log.id}>
                                            <td>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                            <td>{log.data.verseAmount} verses</td>
                                            <td>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                            <td>{prettyPrintDate(log.data.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : ( 
                            <Box sx={{ p:2, textAlign: 'center' }}>
                                <Typography>No recent revision logs.</Typography>
                            </Box>
                        )}
                    </Table>
                </Sheet>
            ) : ( <Typography sx={{ p: 2 }}>Loading...</Typography> )}  
        </Box>
    );
}

export default ViewProgress;