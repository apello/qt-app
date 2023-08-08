import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chapter, ChapterLog, ProgressLog, chapters, get_today, prettyPrintDate } from '../../common/utils';
import Header from "@/components/Header";
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const TrackProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [currentChapterLog, setCurrentChapterLog] = useState<ChapterLog | null>();
    const [previousLog, setPreviousLog] = useState<ProgressLog | null>();

    const [verseRange, setVerseRange] = useState({ startVerse: 1, endVerse: 1 });
    const [readingType, setReadingType] = useState('Memorization');
    const [completed, setCompleted] = useState(false);
    const [alert, setAlert] = useState<JSX.Element>();

    const { query : { chapter } } = useRouter();
    const chapterNameToChapter = new Map(chapters.map(chapter => [chapter.name, chapter]));
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
    const handleChapterSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chapter = chapterNameToChapter.get(e.target.value);
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
                            (currentChapterLog !== undefined && currentChapterLog !== null) ? (currentChapter!.verseCount - currentChapterLog!.lastVerseCompleted) + 1 : currentChapter!.verseCount
                        ) : (verseRange.endVerse - verseRange.startVerse)+1,
                })
                .then(() => {
                    setAlert(<>Successfuly logged progress! View <Link href='/progress/view-recent-progress'>log here</Link> or see your overall progress here!</>);
                })
                .catch((error) => {
                    console.log(`Error updating logs: ${error}`);
                    setAlert(<>Error updating logs. Please try again.</>);
                })
            ])
        }
    };

    if(loading){ return <div>Loading...</div>; }
    if(error) { return <div>Something went wrong. <Link href='/'>Return home.</Link></div>; }
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ padding: '20px' }}>

                    <p>{alert}</p>
                    <h5><Link href='/landing'>Home</Link>/Track Progress</h5>
                    <h1>Track Progress</h1>
                    <h5>Track the individual progress you make, or input progress on the challenges you have created. Tracking currently only looks at chapter-based revision and memorization. </h5>
                    <ProgressForm
                        handleForm={handleForm}
                        handleChapterSearch={handleChapterSearch}
                        currentChapter={currentChapter}
                        setReadingType={setReadingType}
                        setCompleted={setCompleted}
                        completed={completed}
                        previousLog={previousLog}
                        setVerseRange={setVerseRange}
                        verseRange={verseRange} />
                </div>
            </div>
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
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
    verseRange: { startVerse: number; endVerse: number; }
}> = ({
    handleForm,
    handleChapterSearch,
    currentChapter,
    setReadingType,
    setCompleted,
    completed,
    previousLog,
    setVerseRange,
    verseRange
}) => {
    const chapterOptions = chapters.map((chapter) => {
        return <option key={chapter.number} value={chapter.name}>{chapter.number}. {chapter.name}</option>
    });

    return (
        <>
            <select>
                <option>Individual Progress</option>
                <option disabled>Challenge Progress</option>
            </select>

            <div style={{ border: '1px solid black', marginTop: '10px', width: '500px' }}>
                <div style={{ borderBottom: '1px solid black', padding: '10px'}}>

                    {/* Autocomplete search */}
                    {/* <input
                        type='text'
                        placeholder='Search for chapter to begin...'
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)} /> */}

                    <select onChange={handleChapterSearch} value={(currentChapter !== null && currentChapter !== undefined) ? currentChapter!.name : ''}>
                        <option></option>
                        <>{chapterOptions}</>
                    </select>
                </div>

                {(currentChapter !== null && currentChapter !== undefined) ? (
                    <>
                        <div style={{ display: 'flex', borderBottom: '1px solid black', padding: '10px'}}>
                            <label>
                                Type of reading: {' '}
                                <select onChange={(e) => setReadingType(e.target.value)}>
                                    <option>Memorization</option>
                                    <option>Revision</option>
                                </select>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid black', padding: '10px'}}>
                            <button onClick={() => setCompleted(!completed)}>I completed this chapter</button>
                            <p>or...</p>
                        </div>

                        <div style={{ padding: '10px' }}>

                                {(previousLog !== undefined && previousLog !== null) ? (    
                                    <p style={{ border: '1px solid black', padding: '10px' }}>
                                        Previous Log for {currentChapter.name}: {' '}
                                        {previousLog.chapterNumber}:{previousLog.startVerse} - {previousLog.chapterNumber}:{previousLog.endVerse}  {' '}
                                        on {prettyPrintDate(previousLog.createdAt)}
                                    </p>
                                ) : ( <></> )}

                                <p style={{ border: '1px solid black', padding: '10px' }}>
                                    Start Verse - {currentChapter.number} : {' '}
                                    <select 
                                        onChange={(e) => setVerseRange({ ...verseRange, startVerse: parseInt(e.currentTarget.value) })} 
                                        disabled={completed}>
                                        {Array.from(Array(currentChapter.verseCount).keys()).map((verse) => (
                                            <option key={verse}>{verse+1}</option>
                                        ))}
                                    </select>
                                    </p>
                                    
                                <p style={{ border: '1px solid black', padding: '10px'}}>
                                    End Verse - {currentChapter.number} : {' '}
                                    <select 
                                        onChange={(e) => setVerseRange({ ...verseRange, endVerse: parseInt(e.currentTarget.value) })}
                                        disabled={completed}>
                                        {Array.from(Array(currentChapter.verseCount).keys()).map((verse) => (
                                            <option key={verse}>{verse+1}</option>
                                        ))}
                                    </select>
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <button 
                                        onClick={handleForm} 
                                        style={{ height: '50px' }}
                                        disabled={verseRange.startVerse > verseRange.endVerse}>
                                            Log Progress
                                    </button>
                                </div> 
                        </div>
                    </>
                ):( <div style={{ padding: '20px', textAlign: 'center'}}>Select a chapter to begin.</div> )}
            </div>
        </>
    )
}

export default TrackProgress;