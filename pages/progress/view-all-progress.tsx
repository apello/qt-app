import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized, sortLogs } from '../../common/utils';
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Breadcrumbs, Typography, ButtonGroup, Button, Link, Table, Sheet, Input, Select, Option, Card, Divider, Chip, styled, LinearProgress, Grid } from "@mui/joy";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [filterText, setFilterText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [logs, setLogs] = useState<Array<DocumentData>>();
    const [chapterLogs, setChapterLogs] = useState<Array<DocumentData>>();
    const [sortOption, setSortOption] = useState('alphabetical');

    useEffect(() => {
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user !== undefined && user !== null) {
                getDocs(collection(db, `data/${user!.uid}`, 'log'))
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

         const downloadChapterLogs = () => {
            let arr: DocumentData[] = [];
            if(user !== undefined && user !== null) {
                getDocs(collection(db, `data/${user!.uid}`, 'chapter'))
                .then((logs) => {
                    // logs.docs.map((doc) => arr.push({data: doc.data(), id: doc.id}))
                    logs.docs.map((doc) => arr.push(doc.data()))
                    setChapterLogs(arr);
                })
                .catch((error) => {
                    console.log(`Error downloading logs: ${error}`);
                })
            }
        };

        downloadChapterLogs();
        downloadProgressLogs();
    },[user]);
    
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
                            <Typography level='h1' sx={{ mb: 1 }}>All Progress</Typography>
                            <Typography level='title-sm'>
                            View all progress logs of memorization/revision.
                            </Typography>
                        </Box>
                        
                        <ButtonGroup sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button>
                                <NextLink href='/progress/view-recent-progress'>
                                    <Link overlay>
                                        <Typography>Recent Progress</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                            <Button variant='soft' sx={{ cursor: 'default' }}>
                                <Typography>All Progress</Typography>
                            </Button>
                        </ButtonGroup>
                        
                        <Grid container sx={{ gap: 2, p: 0, m: 0 }}>
                            <AllProgressTable 
                                logs={logs ?? []}
                                filterText={filterText}
                                setFilterText={setFilterText} 
                                setSortOption={setSortOption}
                                sortOption={sortOption} /> 

                            <OverallProgress   
                                setSearchText={setSearchText}
                                searchText={searchText}
                                chapterLogs={chapterLogs ?? []} />
                        </Grid>
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
}

const AllProgressTable: React.FC<{ 
    logs: Array<DocumentData>, 
    filterText: string, 
    sortOption: string,
    setFilterText: (_: string) => void,
    setSortOption: (_: string) => void,
}> = ({ logs, filterText, setFilterText, setSortOption, sortOption}) => {
    
    const parsedLogs: Array<ProgressLog> = JSON.parse(JSON.stringify(logs));
    const filteredLogs = parsedLogs.filter(
        (log: ProgressLog) => log.data.chapterName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );
    const sortedLogs = sortLogs(sortOption, filteredLogs);
    
    return (
        <Grid sm={12} md={7.5}>
            {(parsedLogs !== undefined) ? (
                <Sheet sx={{ p: 3, borderRadius: '10px' }} variant='outlined'> 
                    <Box sx={{ display: 'flex', py: 2,  gap: 3 }}>
                        <Input 
                            type='text'
                            placeholder='Search by chapter name:'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} />
                        <Select 
                            placeholder='Sort by...'
                            onChange={(_, newValue) => setSortOption(newValue!.toString())}>
                            <Option value='alphabetical'>Chapter Name - Alphabetically</Option>
                            <Option value='verseAmount'>Verse Amount Completed</Option>
                            <Option value='memorization'>Reading Type - Memorization</Option>
                            <Option value='revision'>Reading Type - Revision</Option>
                            <Option value='createdAt'>Log Date</Option>
                        </Select>
                    </Box>
                    <Table sx={{ my: 2 }} borderAxis='bothBetween'>
                        {(sortedLogs!.length > 0) ? (
                            <>
                                <thead>
                                    <tr>
                                        <th>Chapter Name</th>
                                        <th>Amount Completed</th>
                                        <th>Verse Range</th>
                                        <th>Reading Type</th>
                                        <th>Log Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedLogs.map((log: ProgressLog) => (
                                        <tr key={log.id}>
                                            <td>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                            <td>{log.data.verseAmount} verses</td>
                                            <td>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                            <td>{log.data.readingType}</td>
                                            <td>{prettyPrintDate(log.data.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : ( 
                            <Box sx={{ p:2, textAlign: 'center' }}>
                                <Typography>No logs.</Typography>
                            </Box>
                        )}
                    </Table>
                </Sheet>
            ) : ( <Typography sx={{ p: 2 }}>Loading...</Typography> )}  
        </Grid>
    );
};


const OverallProgress: React.FC<{ 
    setSearchText: (_: string) => void, 
    searchText: string,
    chapterLogs: Array<DocumentData>
 }> = ({ setSearchText, searchText, chapterLogs }) => {

    const filteredChapters = chapters.filter(
        chapter => chapter.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );

    const parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs)); // FIXME: Find better way to parse
    const chapterNameToChapterLog = new Map(parsedChapterLogs.map((chapter: ChapterLog) => [chapter.name, chapter]));
    const chapterNameToChapter = new Map(chapters.map(chapter => [chapter.name, chapter]));

    const LinkElement = styled(Link)(({ theme }) => ({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
        },
    }));

    return (
        <Grid xs={12} md={4}>
            <Card variant='outlined' sx={{ boxShadow: 'none', maxHeight: '90vh' }}>
                <Box sx={{ py: 2 }}>
                    <Typography level='h2' sx={{ mb: 2 }}>Overall Progress</Typography>
                    <Input 
                        type='text' 
                        placeholder='Search chapters here:'
                        onChange={e => setSearchText(e.target.value)} />
                </Box>

                <Divider />

                <Box sx={{ overflow: 'scroll', p: 0 }}>
                    {filteredChapters.map((chapter, index) => (
                        <>
                            <Box 
                                key={index + chapter.number + chapter.name} 
                                sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                                    <Typography level='title-lg'>{chapter.number}. {chapter.name}</Typography>
                                    <Chip
                                        variant="soft"
                                        sx={{ ml: 1 }}>
                                        <NextLink 
                                            href={{
                                                pathname:"track-progress",
                                                query: {
                                                    chapter: chapter.name
                                                }
                                            }}
                                        >
                                            <LinkElement overlay>Track Progress</LinkElement>
                                        </NextLink>
                                    </Chip>
                                </Box>
                                <Typography level='title-sm' sx={{ mt: 2 }}>
                                    {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
                                        'Last reviewed: ' + prettyPrintDate(chapterNameToChapterLog.get(chapter.name)!.lastReviewed)  // Create lastReviewedDate for specific data on days and weeks
                                    ) : ( 'Never reviewed' ))}
                                </Typography>

                                {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, py: 2, boxSizing: 'border-box' }}>
                                        <LinearProgress 
                                            determinate 
                                            value={
                                                parseInt(amountMemorized(chapterNameToChapterLog.get(chapter.name)!.lastVerseCompleted, chapter.name, chapterNameToChapter))
                                        } />

                                        <Typography level='title-sm'>
                                            {amountMemorized(chapterNameToChapterLog.get(chapter.name)!.lastVerseCompleted, chapter.name, chapterNameToChapter)+ '% memorized'}
                                        </Typography>
                                    </Box>

                                ) : ( '' ))}
                                
                                
                            </Box>
                            {(index !== filteredChapters.length-1) ? <Divider /> : <></> }
                        </>

                    ))}
                </Box>
            </Card>
        </Grid>
    );
}


export default ViewProgress;