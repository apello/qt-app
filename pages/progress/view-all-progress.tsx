import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized, sortLogs } from '../../common/utils';
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";

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

    if(loading){ return <div>Loading...</div>; }
    if(error) { return <div>Something went wrong. <Link href='/'>Return home.</Link></div>; }
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                <div style={{ padding: '20px'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>
                    <h1>All Progress</h1>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/progress/view-recent-progress'>Recent Progress</Link></p>
                        <p style={{ border: '1px solid black', padding: '5px' }}>All Progress</p>
                    </div>

                    <h4>View all progress logs of memorization/revision.</h4>

                    <AllProgressTable 
                        logs={logs ?? []}
                        filterText={filterText}
                        setFilterText={setFilterText} 
                        setSortOption={setSortOption}
                        sortOption={sortOption} /> 
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
        <>
            {(parsedLogs !== undefined) ? (
                <> 
                    <div style={{ display: 'flex', padding: '5px', boxSizing: 'border-box', gap: '15px', }}>
                        <p>{sortedLogs.length} logs</p>
                        <input 
                            type='text'
                            placeholder='Search by chapter name...'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} />
                        <select onChange={(e) => setSortOption(e.currentTarget.value)}>
                            <option disabled>Sort by:</option>
                            <option value='alphabetical'>Chapter Name - Alphabetically</option>
                            <option value='verseAmount'>Verse Amount Completed</option>
                            <option value='memorization'>Reading Type - Memorization</option>
                            <option value='revision'>Reading Type - Revision</option>
                            <option value='createdAt'>Log Date</option>
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

                        {(sortedLogs!.length > 0) ? (
                            <tbody>
                                {sortedLogs.map((log: ProgressLog) => (
                                    <tr key={log.id}>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}. {log.data.chapterName}</td>
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
            ) : ( <>Loading...</> )}  
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
                            <h3>{chapter.number}. {chapter.name}</h3>
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