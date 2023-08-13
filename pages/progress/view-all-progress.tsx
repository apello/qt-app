import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, sortLogs, chapterNameToChapter, chapterAmountMemorized, totalAmountMemorized } from '../../common/utils';
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
    const [overallProgress, setOverallProgress] = useState<number>(0);

    useEffect(() => {
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user) {
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
            if(user) {
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

    // Verify if count is correct
    useEffect(() => {
        if(chapterLogs){
            let parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs));
            let sum = parsedChapterLogs.reduce((previous, current) => {
                return previous + current.lastVerseCompleted;
            },0);
            setOverallProgress(totalAmountMemorized(sum));
        }
    },[chapterLogs])
    
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
                                chapterLogs={chapterLogs ?? []} 
                                overallProgress={overallProgress} />
                        </Grid>
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
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
            {/* TODO: Make loading appear */}
            {(logs) ? (
                <Sheet sx={{ p: 3, borderRadius: '10px' }} variant='outlined'> 
                    <Box sx={{ display: 'flex', alignItems:'center', py: 2,  gap: 3 }}>
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
                        <Typography>{parsedLogs.length} logs</Typography>
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
    chapterLogs: Array<DocumentData>,
    overallProgress: number
 }> = ({ setSearchText, searchText, chapterLogs, overallProgress }) => {

    const filteredChapters = chapters.filter(
        chapter => chapter.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );

    const parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs)); // FIXME: Find better way to parse
    const chapterNumberToChapterLog = new Map(parsedChapterLogs.map((chapter: ChapterLog) => [chapter.number, chapter]));

    const LinkElement = styled(Link)({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
        },
    });

    return (
        <Grid xs={12} md={4}>
            <Card variant='outlined' sx={{ boxShadow: 'none', maxHeight: '90vh' }}>
                <Box sx={{ py: 2 }}>
                    <Typography level='h2' sx={{ mb: 2 }}>Overall Progress</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, py:1, boxSizing: 'border-box' }}>
                        <LinearProgress 
                            determinate 
                            value={overallProgress} />

                        <Typography level='title-sm'>{`${overallProgress}% memorized`}</Typography>
                    </Box>
                </Box>
                <Divider />

                <Box sx={{ py: 1 }}>
                    <Input 
                        type='text' 
                        placeholder='Search chapters here:'
                        onChange={e => setSearchText(e.target.value)} />
                </Box>

                <Divider />

                <Box sx={{ overflowY: 'scroll' }}>
                    {(filteredChapters.length > 0) ? (
                        <Box>
                            {filteredChapters.map((chapter, index) => (
                                <Box key={index + chapter.number + chapter.name}>
                                    <Box sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography level='title-lg'>{chapter.number}. {chapter.name}</Typography>
                                            <Chip
                                                variant="soft">
                                                <NextLink 
                                                    href={{
                                                        pathname:"track-progress",
                                                        query: {
                                                            chapter: chapter.name
                                                        }}}>
                                                    <LinkElement overlay>Track Progress</LinkElement>
                                                </NextLink>
                                            </Chip>
                                        </Box>
                                        <Typography level='title-sm' sx={{ mt: 2 }}>
                                            {(chapterNumberToChapterLog.get(chapter.number) !== undefined ? (
                                                'Last reviewed: ' + prettyPrintDate(chapterNumberToChapterLog.get(chapter.number)!.lastReviewed)  // Create lastReviewedDate for specific data on days and weeks
                                            ) : ( 'Never reviewed' ))}
                                        </Typography>

                                        {(chapterNumberToChapterLog.get(chapter.number) !== undefined ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, py: 2, boxSizing: 'border-box' }}>
                                                <LinearProgress 
                                                    determinate 
                                                    value={
                                                        parseInt(chapterAmountMemorized(chapterNumberToChapterLog.get(chapter.number)!.lastVerseCompleted, chapter.name, chapterNameToChapter))
                                                    } 
                                                />

                                                <Typography level='title-sm'>
                                                    {chapterAmountMemorized(chapterNumberToChapterLog.get(chapter.number)!.lastVerseCompleted, chapter.name, chapterNameToChapter)+ '% memorized'}
                                                </Typography>
                                            </Box>
                                        ) : ( '' ))}
                                    </Box>
                                    {(index !== filteredChapters.length-1) ? <Divider /> : <></> }
                                </Box>
                            ))}
                        </Box>
                    ) : ( <Typography sx={{ textAlign: 'center', py: 1 }}>No logs</Typography> )}
                </Box>
            </Card>
        </Grid>
    );
}


export default ViewProgress;