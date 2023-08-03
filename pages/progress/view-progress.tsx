import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate } from '../../common/utils';
import { DocumentData, collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, setUser] = useState<User | null>();
    const [filterText, setFilterText] = useState("");

    const [logs, setLogs] = useState<Array<DocumentData>>();
    // Define these
    const [memorizationLogs, setMemorizationLogs] = useState<any>();
    // Define these
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
        const downloadLogs = () => {
            let arr: DocumentData[] = [];
            if(user !== undefined && user !== null) {
                getDocs(collection(db, `data/${user!.uid}`, 'log'))
                .then((logs) => {
                    logs.docs.map((doc) => arr.push(doc.data()))
                    setLogs(arr);
                })
                .catch((error) => {
                    console.log(`Error downloading logs: ${error}`);
                })
            }
        };

        downloadLogs();
    },[user]);

    useEffect(() => {
        if(logs !== undefined && logs !== null) {
            const parsedLogs = JSON.parse(JSON.stringify(logs));
            setMemorizationLogs(
                parsedLogs!.filter((log: ProgressLog) => log.readingType === 'Memorization')
            );
            setRevisionLogs(
                parsedLogs!.filter((log: ProgressLog) => log.readingType === 'Revision')
            );
        }
    },[logs]);

    const filteredChapters = chapters.filter(
        chapter => chapter.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );
    
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ padding: '20px'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>
                    <h1>Recent Progress</h1>

                    {(memorizationLogs !== undefined) ? (
                        <> 
                            <h3>Memorization</h3>
                            <table style={{ border: '1px solid black' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black' }}>Chapter Name</th>
                                        <th style={{ border: '1px solid black' }}>Amount Completed</th>
                                        <th style={{ border: '1px solid black' }}>Log Date</th>
                                    </tr>
                                </thead>

                                {(memorizationLogs!.length > 0) ? (
                                    <tbody>
                                        {memorizationLogs.map((log: ProgressLog) => (
                                            // Get log ID for key   
                                            <tr key={log.chapterName+log.number+log.verseAmount+log.endVerse}>
                                                <td style={{ border: '1px solid black' }}>{log.chapterName}</td>
                                                <td style={{ border: '1px solid black' }}>{log.verseAmount} verses</td>
                                                <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : ( <div style={{ textAlign: 'center' }}>No current progress.</div> )}
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
                                        <th style={{ border: '1px solid black' }}>Log Date</th>
                                    </tr>
                                </thead>
                                {(revisionLogs!.length > 0) ? (
                                    <tbody>
                                        {revisionLogs.map((log: ProgressLog) => (
                                            // Get log ID for key   
                                            <tr key={log.chapterName+log.number+log.verseAmount+log.endVerse}>
                                                <td style={{ border: '1px solid black' }}>{log.chapterName}</td>
                                                <td style={{ border: '1px solid black' }}>{log.verseAmount} verses</td>
                                                <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : ( <div style={{ textAlign: 'center' }}>No current progress.</div> )}
                            </table>
                        </>
                    ) : ( <></> )}  
                </div>

                <div style={{ padding: '20px'}}>
                    <div style={{ border: '1px solid black', padding: '10px'}}>
                        <h3>Overall Progress</h3>
                        <h5>Quran Memorization Goal - 10% Memorized</h5>
                    </div>

                        <div style={{ border: '1px solid black', padding: '10px'}}>
                        <input 
                            type='text' 
                            placeholder='Search chapters here:'
                            onChange={e => setFilterText(e.target.value)} />
                        <p>{filteredChapters.length} result(s)</p>
                    </div>

                    <div style={{ maxHeight: '100vh', overflow: 'scroll', border: '1px solid black' }}>
                        {filteredChapters.map((chapter) => (
                            <div key={chapter.number + chapter.name} style={{ borderBottom: '1px solid black', padding: '10px'}}>
                                <h3>{chapter.name}</h3>
                                <h5>Last practice: 2 weeks ago</h5>
                                <h6>100% memorized</h6>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )} else {
        return <div>You do not have access to this page. <Link href='/'>Return home.</Link></div>;
    }
}

export default ViewProgress;