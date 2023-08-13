import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chapter, ChapterLog, ProgressLog, chapterNameToChapter, chapters, get_today, prettyPrintDate } from '../../common/utils';
import Header from "@/components/Header";
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Typography, Container, Alert, IconButton, Breadcrumbs, Select, Option, Card, Divider, FormControl, FormLabel, Button, Grid } from "@mui/joy";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendIcon from '@mui/icons-material/Send';

const TrackProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth); // Create user value, loading, and error
    const [currentChapterLog, setCurrentChapterLog] = useState<ChapterLog | null>(); // Current data for selected chapter
    const [previousLog, setPreviousLog] = useState<ProgressLog | null>(); // Previous progress log for selected chapter

    const [verseRange, setVerseRange] = useState({ startVerse: 1, endVerse: 1 }); // Verse range (start verse, end verse) selected by user
    const [readingType, setReadingType] = useState<string>(''); // Reading type (Memorization, Revision) selected by user
    const [completed, setCompleted] = useState(false); // Chapter completion status selected by user
    const [alert, setAlert] = useState<JSX.Element>(); // Alert message of success or error containing Link elements
    const [openAlert, setOpenAlert] = useState(false); // Alert boolean
    const [formLoading, setFormLoading] = useState(false); // Loading boolean for Log Progress button

    const { query : { chapter } } = useRouter(); // Chapter name data sent the 'Track Progress' button on Overall Progress card
    // Get chapter information from chapterNameToChapter Map object in commons/utils
    const params = (chapter !== null && chapter !== undefined) ? chapterNameToChapter.get(chapter!.toString()) : undefined; 
    // Set currentChapter equal to params, which is either undefined or contains the Chapter value given from the router
    const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(params);

    // Download current chapter log information and put that information in currentChapterLog 
    useEffect(() => {
        const downloadCurrentChapterLog = () => {
            // TODO: Check if operation works with just (currentChapter && user)
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

    // Download most recent log information on chapter and put that information in setPreviousLog 
    useEffect(() => {
        const downloadPreviousLog = () => {
            if((currentChapter) 
            && (user !== undefined && user !== null)) {
                let arr: DocumentData[] = [];
                // Progress log where the log has the selected chapter name and reading type
                getDocs(query(
                    collection(db, `data/${user!.uid}/log`), 
                    where('chapterName', '==', currentChapter.name),
                    where('readingType', '==', readingType),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                ))
                .then((logs) => {
                    // Clean data up and set to setPreviousLog
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

    // TODO: Change to autocomplete
    // Sets value selected from select to currentChapter and clears previously selected values
    const handleChapterSearch = (newValue: string) => {
        const chapter = chapterNameToChapter.get(newValue);
        setCurrentChapter(chapter);
        // Reset values for next chapter
        setVerseRange({...verseRange, startVerse: 1, endVerse: 1});
        setPreviousLog(null);
        setCompleted(false);
    };

    // Entirely clears the form after successful submission
    const clearForm = () => {
        setCurrentChapter(undefined);
        setVerseRange({...verseRange, startVerse: 1, endVerse: 1});
        setPreviousLog(null);
        setCompleted(false);
        setReadingType('');
    };

    const handleForm = () => {
        if(currentChapter && user) {
            setFormLoading(true);
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
                    // If does not exist, create a new one
                    setDoc(doc(db, `data/${user!.uid}/chapter`, `${currentChapter!.number}`), {
                        number: currentChapter.number,
                        name: currentChapter.name,
                        lastReviewed: get_today(),
                        lastVerseCompleted: (completed) ? currentChapter.verseCount : verseRange.endVerse
                    })
                ),
                addDoc(collection(db, `data/${user!.uid}/log`), {
                    // Archived might be used later for something, still planning
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
                    clearForm();
                    setFormLoading(false);
                    setOpenAlert(true);
                    setAlert(<>Successfuly logged progress! View <Link href='/progress/view-recent-progress'>log here</Link> or see your <Link href='/progress/view-all-progress'>overall progress here!</Link></>);
                })
                .catch((error) => {
                    setFormLoading(false);
                    console.log(`Error updating logs: ${error}`);
                    setOpenAlert(true);
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

                        {/* TODO: Break the progress form into even smaller components */}
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
                            readingType={readingType}
                            formLoading={formLoading} />

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
    readingType: string,
    formLoading: boolean
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
    readingType,
    formLoading
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

                    {/* TODO: Just (currentChapter)? */}
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
                                            Previous log for {currentChapter.name}: {' '}
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
                                    {(!formLoading) ? (
                                         <Button 
                                            color='neutral'
                                            variant='outlined'
                                            onClick={handleForm} 
                                            sx={{ height: '50px' }}
                                            disabled={
                                                // Disabled:
                                                // if start verse is greater than endverse
                                                // if user has not changed the values from their default value
                                                // if they did not select a reading type
                                                verseRange.startVerse > verseRange.endVerse
                                                || ((verseRange.startVerse === 1 && verseRange.endVerse === 1) 
                                                    && !completed)
                                                || readingType === ''
                                            }
                                        >
                                            Log Progress
                                        </Button>  
                                    ) : (
                                        <Button
                                            color='neutral'
                                            sx={{ height: '50px' }}
                                            variant="solid"
                                            loading
                                            loadingPosition="end"
                                            endDecorator={<SendIcon />}
                                        >
                                            Log Progress
                                        </Button>
                                    )}
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