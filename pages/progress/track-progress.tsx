import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chapter, chapters } from '../../common/utils';
import Header from "@/components/Header";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [filterText, setFilterText] = useState('');
    const [chapter, setChapter] = useState<Chapter | null>();
    const [verseRange, setVerseRange] = useState({ startVerse: 1, endVerse: 1 });
    const [readingType, setReadingType] = useState('');
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
            onAuthStateChanged(auth, (authUser) => {
                if(authUser) {
                    setUser(authUser);
                } else {
                    setUser(null);
                }
            });
    },[]);

    const chapterNameToChapter = new Map(chapters.map(chapter => [chapter.name, chapter]));

    // Will change with autocomplete
    const handleChapterSearch = (e: any) => {
        const chapter = chapterNameToChapter.get(e.target.value);
        setChapter(chapter);
    };

    const handleForm = () => {};
    
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ padding: '20px', width: '100%'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>
                    <h1>Track Progress</h1>
                    <h5>Track the individual progress you make, or input progress on the challenges you have created. Tracking currently only looks at chapter-based revision and memorization. </h5>
                    <select onChange={(e) => setReadingType(e.currentTarget.value)}>
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

                            <select onChange={handleChapterSearch}>
                                <option>Al-Fatiha</option>
                                <option>Al-Ankabut</option>
                            </select>
                        </div>

                        {(chapter !== null && chapter !== undefined) ? (
                            <>
                                <div style={{ display: 'flex', borderBottom: '1px solid black', padding: '10px'}}>
                                    <label>
                                        Type of reading: {' '}
                                        <select>
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
                                        <div>
                                            <p style={{ border: '1px solid black', padding: '10px' }}>Start Verse - {chapter.number} : {' '}
                                                <select 
                                                    onChange={(e) => setVerseRange({ ...verseRange, startVerse: parseInt(e.currentTarget.value) })} 
                                                    disabled={completed}>
                                                    {Array.from(Array(chapter.verseCount).keys()).map((verse) => (
                                                        <option key={verse}>{verse+1}</option>
                                                    ))}
                                                </select>
                                            </p>
                                            <p style={{ border: '1px solid black', padding: '10px'}}>End Verse - {chapter.number} : {' '}
                                                <select 
                                                    onChange={(e) => setVerseRange({ ...verseRange, endVerse: parseInt(e.currentTarget.value) })}
                                                    disabled={completed}>
                                                    {Array.from(Array(chapter.verseCount).keys()).map((verse) => (
                                                        <option key={verse}>{verse+1}</option>
                                                    ))}
                                                </select>
                                            </p>
                                        </div>

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

export default ViewProgress;