import { auth, db } from "@/firebase/clientApp";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, amountMemorized } from '../../common/utils';
import { DocumentData, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Header from "@/components/Header";
import { parse } from "path";
import { useAuthState } from "react-firebase-hooks/auth";

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [logs, setLogs] = useState<Array<DocumentData>>();

    // Define these
    const [memorizationLogs, setMemorizationLogs] = useState<any>();
    const [revisionLogs, setRevisionLogs] = useState<any>();


    useEffect(() => {
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user !== undefined && user !== null) {
                getDocs(query(collection(db, `data/${user!.uid}`, 'log'), limit(15), orderBy('createdAt', 'desc')))
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
       
    if(loading){ return <div>Loading...</div>; }
    if(error) { return <div>Something went wrong. <Link href='/'>Return home.</Link></div>; }
    if(user) { return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ padding: '20px'}}>
                    <h5><Link href='/landing'>Home</Link>/View Progress</h5>
                    <h1>Recent Progress</h1>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ border: '1px solid black', padding: '5px' }}>Recent Progress</p>
                        <p style={{ border: '1px solid black', padding: '5px' }}><Link href='/progress/view-all-progress'>All Progress</Link></p>
                    </div>

                    <h4>View the last 15 logs you memorized/revised.</h4>

                    <RecentProgressTable
                        memorizationLogs={memorizationLogs}
                        revisionLogs={revisionLogs} />
                </div>
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
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.verseAmount} verses</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                        <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.data.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : ( <p style={{ textAlign: 'center' }}>No recent memorization logs.</p> )}
                        </table>
                </>
            ) : ( <>Loading...</> )}  

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
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.verseAmount} verses</td>
                                        <td style={{ border: '1px solid black' }}>{log.data.chapterNumber}:{log.data.startVerse} -  {log.data.chapterNumber}:{log.data.endVerse}</td>
                                        <td style={{ border: '1px solid black' }}>{prettyPrintDate(log.data.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : ( <p style={{ textAlign: 'center' }}>No recent revision logs.</p> )}
                    </table>
                </>
            ) : ( <>Loading...</> )}  
        </>
    );
}

export default ViewProgress;