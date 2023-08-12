import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chapter, ChapterLog, ProgressLog, chapterNameToChapter, chapters, get_today, prettyPrintDate } from '../../common/utils';
import Header from "@/components/Header";
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Typography, Container, Alert, IconButton, Breadcrumbs, Select, Option, Sheet, Card, Divider, FormControl, FormLabel, Button, Grid } from "@mui/joy";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const TrackProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [currentChapterLog, setCurrentChapterLog] = useState<ChapterLog | null>();
    const [previousLog, setPreviousLog] = useState<ProgressLog | null>();

    const [verseRange, setVerseRange] = useState({ startVerse: 1, endVerse: 1 });
    const [readingType, setReadingType] = useState<string>('');
    const [completed, setCompleted] = useState(false);
    const [alert, setAlert] = useState<JSX.Element>();
    const [openAlert, setOpenAlert] = useState(false);

    const { query : { chapter } } = useRouter();
    const params = (chapter !== null && chapter !== undefined) ? chapterNameToChapter.get(chapter!.toString()) : undefined;
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(params);

    useEffect(() => {
        const downloadCurrentChapterLog = () => {
            if((currentChapter !== undefined && currentChapter !== null) 
            && (user !== undefined && user !== null)) {
                getDoc(doc(db, `data/${user!.uid}/chapter`, `${currentChapter!.number}`))
                .then((doc) => {
                    const chapter: ChapterLog = JSON.parse(JSON.stringify(doc.data()));
                    setCurrentChapterLog(chapter);
                })
                .catch((error) => {
                    setCurrentChapterLog(null);
                    console.log(`Error downloading current chapter log: ${error}`);
                })
            }
        };
        downloadCurrentChapterLog();
    },[currentChapter, user]);

    useEffect(() => {
        const downloadPreviousLog = () => {
            if((currentChapter !== undefined && currentChapter !== null) 
            && (user !== undefined && user !== null)) {
                let arr: DocumentData[] = [];
                getDocs(query(
                    collection(db, `data/${user!.uid}/log`), 
                    where('chapterName', '==', currentChapter.name),
                    where('readingType', '==', readingType),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                ))
                .then((logs) => {
                    logs.docs.map((doc) => arr.push(doc.data()));
                    let log = JSON.parse(JSON.stringify(arr[0]));
                    setPreviousLog(log);
                })
                .catch((error) => {
                    setPreviousLog(null);
                    console.log(`Error downloading previous progress log: ${error}`);
                })
            }
        };
        downloadPreviousLog();
    },[currentChapter, readingType, user]);

    // Will change with autocomplete
    const handleChapterSearch = (newValue: string) => {
        const chapter = chapterNameToChapter.get(newValue);
        setCurrentChapter(chapter);
        // Reset values for next chapter
        setVerseRange({...verseRange, startVerse: 1, endVerse: 1});
        setPreviousLog(null);
        setCompleted(false);
    };

    const handleForm = () => {
        // Do some validation to prevent user from spamming same range 
        if((currentChapter !== undefined && currentChapter !== null)
        && (user !== undefined && user !== null)) {
            Promise.all([
                // If log for chapter already exists
                (currentChapterLog !== undefined && currentChapterLog !== null) ? (
                    updateDoc(doc(db, `data/${user!.uid}/chapter`, `${currentChapter!.number}`), {
                        lastReviewed: get_today(),
                        lastVerseCompleted: 
                        // If it's completed, put chapter verse count, else if it's not revision and the new end verse 
                        // is larger than the current one, put that in, else keep it the same
                        (completed) ? ( currentChapter.verseCount ) : (
                            (readingType === 'Memorization' && currentChapterLog.lastVerseCompleted < verseRange.endVerse) ?  
                            verseRange.endVerse : currentChapterLog.lastVerseCompleted
                        )
                    })
                ) : (
                    setDoc(doc(db, `data/${user!.uid}/chapter`, `${currentChapter!.number}`), {
                        name: currentChapter.name,
                        lastReviewed: get_today(),
                        lastVerseCompleted: (completed) ? currentChapter.verseCount : verseRange.endVerse
                    })
                ),
                addDoc(collection(db, `data/${user!.uid}/log`), {
                    chapterNumber: currentChapter!.number,
                    archived: false,
                    chapterName: currentChapter!.name,
                    createdAt: get_today(),
                    endVerse: (completed) ? currentChapter!.verseCount : verseRange.endVerse,
                    readingType: readingType,
                    // FIXME: Rewrite and comment these conditionals

                    /* 
                        If completed
                            If current chapter log exists
                                If the current chapter log's last completed verse doesn't equal the verse count of the chapter, start verse is last verse completed
                                Else start verse is 1
                            Else startverse is 1
                        Else startverse is the inputted start verse
                    */
                    startVerse: 
                        (completed) ? (
                            ((currentChapterLog !== undefined && currentChapterLog !== null)) ? (
                                (currentChapterLog.lastVerseCompleted !== currentChapter.verseCount) ? (currentChapterLog!.lastVerseCompleted) : ( 1 ) 
                            ) : ( 1 )
                        ) : (verseRange.startVerse),
                    verseAmount: 
                        (completed) ? (
                            (currentChapterLog !== undefined && currentChapterLog !== null) ? (
                                (currentChapterLog.lastVerseCompleted !== currentChapter.verseCount) ? (
                                    (currentChapter!.verseCount - currentChapterLog!.lastVerseCompleted) + 1 
                                ) :  currentChapter!.verseCount
                            ) : currentChapter!.verseCount
                        ) : (verseRange.endVerse - verseRange.startVerse)+1,
                })
                .then(() => {
                    setOpenAlert(true);
                    setAlert(<>Successfuly logged progress! View <Link href='/progress/view-recent-progress'>log here</Link> or see your <Link href='/progress/view-all-progress'>overall progress here!</Link></>);
                })
                .catch((error) => {
                    setOpenAlert(true);
                    console.log(`Error updating logs: ${error}`);
                    setAlert(<>Error updating logs. Please try again.</>);
                })
            ])
        }
    };

    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box>
                    <Header />
                    <Container sx={{ my: 3 }}>

                    {(openAlert) ? (
                            // Hide Alert
                            <Alert 
                                variant="soft" 
                                sx={{ my: 2 }}
                                endDecorator={
                                    <IconButton 
                                        variant="plain" 
                                        size="sm" 
                                        color="neutral" 
                                        onClick={() => setOpenAlert(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                }>
                                    {alert}
                            </Alert>
                        ) : ( <></> )}


                        <Box sx={{ mb: 2 }}>
                            <Breadcrumbs sx={{ px: 0 }}>
                                <Typography level='title-sm'>
                                    <Link href="/landing">Home</Link>
                                </Typography>
                                <Typography level='title-sm'>Track Progress</Typography>
                            </Breadcrumbs>
                            <Typography level='h1'>Track Progress</Typography>
                            <Typography level='title-sm'>
                            Track the individual progress you make, or input progress on the challenges you have created. Tracking currently only looks at chapter-based revision and memorization. 
                            </Typography>
                        </Box>

                        <ProgressForm
                            handleForm={handleForm}
                            handleChapterSearch={handleChapterSearch}
                            currentChapter={currentChapter}
                            setReadingType={setReadingType}
                            setCompleted={setCompleted}
                            completed={completed}
                            previousLog={previousLog}
                            setVerseRange={setVerseRange}
                            verseRange={verseRange}
                            readingType={readingType} />

                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <Link href='/'>Return home.</Link></Typography>
            )}
        </CssVarsProvider>
    );
   
}

const ProgressForm: React.FC<{
    handleForm: any,
    handleChapterSearch: any,
    currentChapter: Chapter | undefined,
    setReadingType: (_: string) => void, 
    setCompleted: (_: boolean) => void,
    completed: boolean,
    previousLog: ProgressLog | null | undefined,
    setVerseRange: (_: any) => void,
    verseRange: { startVerse: number; endVerse: number; },
    readingType: string
}> = ({
    handleForm,
    handleChapterSearch,
    currentChapter,
    setReadingType,
    setCompleted,
    completed,
    previousLog,
    setVerseRange,
    verseRange,
    readingType
}) => {
    const chapterOptions = chapters.map((chapter) => {
        return <Option key={chapter.number+chapter.name} value={chapter.name}>{chapter.number}. {chapter.name}</Option>
    });

    return (
        <Box sx={{ mt: 3 }}>
            <Select sx={{ width: 240, my: 2 }} value='individual'>
                <Option value='individual'>Individual Progress</Option>
                <Option value='challenge' disabled>Challenge Progress</Option>
            </Select>

            <Grid container>
                <Grid xs={12} md={6}>
                    <Card>
                    <Box sx={{ py: 1 }}>

                        {/* Autocomplete search */}
                        {/* <input
                            type='text'
                            placeholder='Search for chapter to begin...'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} /> */}

                        <Select 
                            onChange={(_, newValue) => handleChapterSearch(newValue)} 
                            value={(currentChapter !== null && currentChapter !== undefined) ? currentChapter!.name : ''}
                            placeholder='Select a chapter...'>
                            <>{chapterOptions}</>
                        </Select>
                    </Box>

                    <Divider />

                    {(currentChapter !== null && currentChapter !== undefined) ? (
                        <div>
                            <FormControl sx={{ pb: 2 }}>
                                <FormLabel>Type of reading:</FormLabel>
                                <Select 
                                    placeholder='Choose a reading type:'
                                    onChange={(_, newValue) => setReadingType(newValue!.toString())}>
                                    <Option value='Memorization'>Memorization</Option>
                                    <Option value='Revision'>Revision</Option>
                                </Select>
                            </FormControl>

                            <Divider />

                            <Box sx={{ display: 'flex', gap: 2, py: 2}}>
                                <Button 
                                    color='neutral'
                                    variant={(completed) ? 'solid' : 'outlined'}
                                    onClick={() => setCompleted(!completed)}>
                                        I completed this chapter
                                </Button>
                                <Typography level='title-sm' sx={{ mt: 1 }}>or...</Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ my: 2 }} >
                                {(previousLog !== undefined && previousLog !== null) ? (    
                                    <Card sx={{ border: 1, borderColor: '#bdbdbd', boxShadow: 'none', mb: 2  }}>
                                        <Typography level='title-sm'>
                                        Previous Log for {currentChapter.name}: {' '}
                                        {previousLog.chapterNumber}:{previousLog.startVerse} - {previousLog.chapterNumber}:{previousLog.endVerse}  {' '}
                                        on {prettyPrintDate(previousLog.createdAt)}
                                        </Typography>
                                    </Card>
                                ) : ( <></> )}


                                <FormControl sx={{ pb: 2 }}>
                                    <FormLabel>Start Verse:</FormLabel>
                                    <Select 
                                        placeholder={`Choose a start verse in ${currentChapter.name}:`}
                                        onChange={(_, newValue) => setVerseRange({ ...verseRange, startVerse: parseInt(newValue!.toString()) })} 
                                        disabled={completed}>
                                        {Array.from(Array(currentChapter.verseCount).keys()).map((verse) => (
                                            <Option key={verse} value={verse+1}>{currentChapter.number}:{verse+1}</Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ pb: 2 }}>
                                    <FormLabel>End Verse:</FormLabel>
                                    <Select 
                                        placeholder={`Choose a end verse in ${currentChapter.name}:`}
                                        onChange={(_, newValue) => setVerseRange({ ...verseRange, endVerse: parseInt(newValue!.toString()) })} 
                                        disabled={completed}>
                                        {Array.from(Array(currentChapter.verseCount).keys()).map((verse) => (
                                            <Option key={verse} value={verse+1}>{currentChapter.number}:{verse+1}</Option>
                                        ))}
                                    </Select>
                                </FormControl>
            
                                

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button 
                                        color='neutral'
                                        variant='outlined'
                                        onClick={handleForm} 
                                        sx={{ height: '50px' }}
                                        disabled={
                                            verseRange.startVerse > verseRange.endVerse
                                            || ((verseRange.startVerse === 1 && verseRange.endVerse === 1) 
                                                && !completed)
                                            || readingType === ''
                                        }>
                                        Log Progress
                                    </Button>  
                                </Box> 
                            </Box>
                        </div>
                    ) : ( <Typography sx={{ padding: '20px', textAlign: 'center' }}>Select a chapter to begin.</Typography> )}
                    </Card>
                </Grid>
            </Grid>
            
        </Box>
    )
}

export default TrackProgress;