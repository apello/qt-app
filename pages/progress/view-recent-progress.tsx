import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized } from '../../common/utils';
import { DocumentData, collection, getDocs, limit, query } from "firebase/firestore";
import Header from "@/components/Header";
import { parse } from "path";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [filterText, setFilterText] = useState("");

    const [logs, setLogs] = useState<Array<DocumentData>>();
    const [chapterLogs, setChapterLogs] = useState<Array<DocumentData>>();

    // Define these
    const [memorizationLogs, setMemorizationLogs] = useState<any>();
    const [revisionLogs, setRevisionLogs] = useState<any>();

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
                getDocs(query(collection(db, `data/${user!.uid}`, 'log'), limit(10)))
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

        // const downloadChapterLogs = () => {
        //     let arr: DocumentData[] = [];
        //     if(user !== undefined && user !== null) {
        //         getDocs(collection(db, `data/${user!.uid}`, 'chapter'))
        //         .then((logs) => {
        //             // logs.docs.map((doc) => arr.push({data: doc.data(), id: doc.id}))
        //             logs.docs.map((doc) => arr.push(doc.data()))
        //             setChapterLogs(arr);
        //         })
        //         .catch((error) => {
        //             console.log(`Error downloading logs: ${error}`);
        //         })
        //     }
        // };

        // downloadChapterLogs();
        downloadProgressLogs();
    },[user]);

    useEffect(() => {
        if(logs !== undefined && logs !== null) {
            const parsedLogs = JSON.parse(JSON.stringify(logs));
            setMemorizationLogs(
                parsedLogs!.filter((log: ProgressLog) => log.data.readingType === 'Memorization')
            );
            setRevisionLogs(
                parsedLogs!.filter((log: ProgressLog) => log.data.readingType === 'Revision')
            );
        }
    },[logs, setMemorizationLogs, setRevisionLogs]);
       
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ padding: '20px'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ border: '1px solid black', padding: '5px' }}>Recent Progress</p>
                        <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/progress/view-all-progress'>All Progress</Link></p>
                    </div>

                    <h1>Recent Progress</h1>
                    <h4>View the last 10 logs you memorized/revised.</h4>

                    <RecentProgressTable
                        memorizationLogs={memorizationLogs}
                        revisionLogs={revisionLogs} />
                </div>

                {/* <OverallProgress   
                    setFilterText={setFilterText}
                    filterText={filterText}
                    chapterLogs={chapterLogs ?? []} /> */}
            </div>
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}


const RecentProgressTable: React.FC<{ memorizationLogs: any, revisionLogs: any }> = ({ memorizationLogs, revisionLogs }) => {
    return (
        <>
            {(memorizationLogs !== undefined) ? (
                <> 
                    <h3>Memorization</h3>
                    <table style={{ border: '1px solid black' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black' }}>Chapter Name</th>
                                <th style={{ border: '1px solid black' }}>Amount Completed</th>
                                <th style={{ border: '1px solid black' }}>Verse Range</th>
                                <th style={{ border: '1px solid black' }}>Log Date</th>
                            </tr>
                        </thead>

                        {(memorizationLogs!.length > 0) ? (
                            <tbody>
                                {memorizationLogs.map((log: ProgressLog) => (
                                    <tr key={log.id}>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterName}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.verseAmount} verses</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                        <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.data.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : ( <p style={{ textAlign: 'center' }}>No recent memorization logs.</p> )}
                        </table>
                </>
            ) : ( <></> )}  

            {(revisionLogs !== undefined) ? (
                <> 
                    <h3>Revision</h3>
                    <table style={{ border: '1px solid black' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black' }}>Chapter Name</th>
                                <th style={{ border: '1px solid black' }}>Amount Completed</th>
                                <th style={{ border: '1px solid black' }}>Verse Range</th>
                                <th style={{ border: '1px solid black' }}>Log Date</th>
                            </tr>
                        </thead>
                        {(revisionLogs!.length > 0) ? (
                            <tbody>
                                {revisionLogs.map((log: ProgressLog) => (
                                    <tr key={log.id}>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterName}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.verseAmount} verses</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                        <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.data.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : ( <p style={{ textAlign: 'center' }}>No recent revision logs.</p> )}
                    </table>
                </>
            ) : ( <></> )}  
        </>
    );
}

// const OverallProgress: React.FC<{ 
//     setFilterText: (_: string) => void, 
//     filterText: string,
//     chapterLogs: Array<DocumentData>
//  }> = ({ setFilterText, filterText, chapterLogs }) => {

//     const filteredChapters = chapters.filter(
//         chapter => chapter.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
//     );

//     const parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs)); // FIXME: Find better way to parse
//     const chapterNameToChapterLog = new Map(parsedChapterLogs.map((chapter: ChapterLog) => [chapter.name, chapter]));
//     const chapterNameToChapter = new Map(chapters.map(chapter => [chapter.name, chapter]));

//     return (
//         <div style={{ padding: '20px'}}>
//             <div style={{ border: '1px solid black', padding: '10px'}}>
//                 <h3>Overall Progress</h3>
//             </div>

//                 <div style={{ border: '1px solid black', padding: '10px'}}>
//                 <input 
//                     type='text' 
//                     placeholder='Search chapters here:'
//                     onChange={e => setFilterText(e.target.value)} />
//                 <p>{filteredChapters.length} result(s)</p>
//             </div>

//             <div style={{ maxHeight: '100vh', overflow: 'scroll', border: '1px solid black' }}>
//                 {filteredChapters.map((chapter) => (
//                     <div key={chapter.number + chapter.name} style={{ borderBottom: '1px solid black', padding: '10px'}}>
//                         <div style={{ display: 'flex', alignContent: 'center' }}>
//                             <h3>{chapter.name}</h3>
//                             <p style={{ paddingLeft: '5px'}}>
//                                 <Link 
//                                     href={{
//                                         pathname:"track-progress",
//                                         query: {
//                                             chapter: chapter.name
//                                         }
//                                     }}
//                                 >Track Progress</Link>
//                             </p>
//                         </div>
//                         <h5>
//                             {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
//                                 'Last reviewed: ' + prettyPrintDate(chapterNameToChapterLog.get(chapter.name)!.lastReviewed) // Create lastReviewedDate for specific data on days and weeks
//                             ) : ( 'Never reviewed' ))}
//                         </h5>
//                         <h6>
//                             {(chapterNameToChapterLog.get(chapter.name) !== undefined ? (
//                                 amountMemorized(chapterNameToChapterLog.get(chapter.name)!.lastVerseCompleted, chapter.name, chapterNameToChapter) + '% memorized'
//                             ) : ( '' ))}
//                         </h6>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

export default ViewProgress;