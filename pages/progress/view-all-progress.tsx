import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized } from '../../common/utils';
import { DocumentData, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Header from "@/components/Header";
import { parse } from "path";
import { set } from "firebase/database";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [filterText, setFilterText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [logs, setLogs] = useState<Array<DocumentData>>();
    const [chapterLogs, setChapterLogs] = useState<Array<DocumentData>>();
    const [sortOption, setSortOption] = useState('');

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
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user !== undefined && user !== null) {
                getDocs(query(collection(db, `data/${user!.uid}`, 'log'), orderBy('createdAt', 'desc')))
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
       
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ padding: '20px'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/progress/view-recent-progress'>Recent Progress</Link></p>
                        <p style={{ border: '1px solid black', padding: '5px' }}>All Progress</p>
                    </div>

                    <h1>All Progress</h1>
                    <h4>View all progress logs of memorization/revision.</h4>

                    <AllProgressTable 
                        logs={logs ?? []}
                        filterText={filterText}
                        setFilterText={setFilterText} 
                        setSortOption={setSortOption} /> 
                </div>

                <OverallProgress   
                    setSearchText={setSearchText}
                    searchText={searchText}
                    chapterLogs={chapterLogs ?? []} />

            </div>
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}


const AllProgressTable: React.FC<{ 
    logs: Array<DocumentData>, 
    filterText: string, 
    setFilterText: (_: string) => void,
    setSortOption: (_: string) => void 
}> = ({ logs, filterText, setFilterText, setSortOption}) => {
    
    const parsedLogs = JSON.parse(JSON.stringify(logs));
    const filteredParsedLogs = parsedLogs.filter(
        (log: ProgressLog) => log.data.chapterName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );


    return (
        <>
            {(filteredParsedLogs !== undefined) ? (
                <> 
                    <div style={{ display: 'flex', padding: '5px', boxSizing: 'border-box', gap: '15px', justifyContent: 'end', alignItems: 'end' }}>
                        <p>{parsedLogs.length} logs</p>
                        <input 
                            type='text'
                            placeholder='Search by chapter name...'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} />
                        <select onChange={(e) => setSortOption(e.currentTarget.value)}>
                            <option disabled>Sort by:</option>
                            <option value='alphabetical'>Chapter Name - Alphabetically</option>
                            <option value='verseAmount'>Verse Amount Completed</option>
                            <option value='readingType'>Reading Type</option>
                            <option value='date'>Log Date</option>
                        </select>
                    </div>
                    <table style={{ border: '1px solid black' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black' }}>Chapter Name</th>
                                <th style={{ border: '1px solid black' }}>Amount Completed</th>
                                <th style={{ border: '1px solid black' }}>Verse Range</th>
                                <th style={{ border: '1px solid black' }}>Reading Type</th>
                                <th style={{ border: '1px solid black' }}>Log Date</th>
                            </tr>
                        </thead>

                        {(filteredParsedLogs!.length > 0) ? (
                            <tbody>
                                {filteredParsedLogs.map((log: ProgressLog) => (
                                    // Get log ID for key   
                                    <tr key={log.id}>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterName}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.verseAmount} verses</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.readingType}</td>
                                        <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.data.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : ( <p style={{ textAlign: 'center' }}>No logs.</p> )}
                        </table>
                </>
            ) : ( <></> )}  
        </>
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

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ border: '1px solid black', padding: '10px'}}>
                <h3>Overall Progress</h3>
            </div>

            <div style={{ border: '1px solid black', padding: '10px'}}>
                <input 
                    type='text' 
                    placeholder='Search chapters here:'
                    onChange={e => setSearchText(e.target.value)} />
                <p>{filteredChapters.length} result(s)</p>
            </div>

            <div style={{ maxHeight: '90vh', overflow: 'scroll', border: '1px solid black' }}>
                {filteredChapters.map((chapter) => (
                    <div key={chapter.number + chapter.name} style={{ borderBottom: '1px solid black', padding: '10px'}}>
                        <div style={{ display: 'flex', alignContent: 'center' }}>
                            <h3>{chapter.name}</h3>
                            <p style={{ paddingLeft: '5px'}}>
                                <Link 
                                    href={{
                                        pathname:"track-progress",
                                        query: {
                                            chapter: chapter.name
                                        }
                                    }}
                                >Track Progress</Link>
                            </p>
                        </div>
                        <h5>
                            {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
                                'Last reviewed: ' + prettyPrintDate(chapterNameToChapterLog.get(chapter.name)!.lastReviewed) // Create lastReviewedDate for specific data on days and weeks
                            ) : ( 'Never reviewed' ))}
                        </h5>
                        <h6>
                            {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
                                amountMemorized(chapterNameToChapterLog.get(chapter.name)!.lastVerseCompleted, chapter.name, chapterNameToChapter) + '% memorized'
                            ) : ( '' ))}
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default ViewProgress;