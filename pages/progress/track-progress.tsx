import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chapter, ChapterLog, ProgressLog, chapters, get_today, prettyPrintDate } from '../../common/utils';
import Header from "@/components/Header";
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";

const TrackProgress: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [filterText, setFilterText] = useState('');
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
        onAuthStateChanged(auth, (authUser) => {
            if(authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });
    },[]);


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
    // Define type for event
    const handleChapterSearch = (e: any) => {
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
                    startVerse: 
                        (completed) ? (
                            (currentChapterLog !== undefined && currentChapterLog !== null) ? currentChapterLog!.lastVerseCompleted : 1
                        ) : verseRange.startVerse,
                    verseAmount: 
                        (completed) ? (
                            (currentChapterLog !== undefined && currentChapterLog !== null) ? (currentChapter!.verseCount - currentChapterLog!.lastVerseCompleted) + 1 : currentChapter!.verseCount
                        ) : (verseRange.endVerse - verseRange.startVerse)+1,
                })
                .then(() => {
                    setAlert(<>Successfuly logged progress! View <Link href='/progress/view-progress'>log here</Link> or see your overall progress here!</>);
                })
                .catch((error) => {
                    console.log(`Error updating logs: ${error}`);
                    setAlert(<>Error updating logs. Please try again.</>);
                })
            ])
        }
    };

    const chapterOptions = chapters.map((chapter) => {
        return <option key={chapter.number}>{chapter.name}</option>
    });

    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ padding: '20px', width: '100%'}}>

                    <p>{alert}</p>
                    <h5><Link href='/landing'>Home</Link>/Track Progress</h5>
                    <h1>Track Progress</h1>
                    <h5>Track the individual progress you make, or input progress on the challenges you have created. Tracking currently only looks at chapter-based revision and memorization. </h5>
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
                                            <p style={{ border: '1px solid black', padding: '10px' }}>Previous Log for {currentChapter.name}: {' '}
                                                {previousLog.chapterNumber}:{previousLog.startVerse} - {previousLog.chapterNumber}:{previousLog.endVerse}  {' '}
                                                on {prettyPrintDate(previousLog.createdAt)}
                                            </p>
                                        ) : ( <></> )}

                                        <p style={{ border: '1px solid black', padding: '10px' }}>Start Verse - {currentChapter.number} : {' '}
                                                <select 
                                                    onChange={(e) => setVerseRange({ ...verseRange, startVerse: parseInt(e.currentTarget.value) })} 
                                                    disabled={completed}>
                                                    {Array.from(Array(currentChapter.verseCount).keys()).map((verse) => (
                                                        <option key={verse}>{verse+1}</option>
                                                    ))}
                                                </select>
                                            </p>
                                            
                                        <p style={{ border: '1px solid black', padding: '10px'}}>End Verse - {currentChapter.number} : {' '}
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
                </div>
            </div>
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default TrackProgress;