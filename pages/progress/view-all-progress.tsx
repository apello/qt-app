import { auth, db } from "@/firebase/clientApp";
import { NextPage } from "next";
import NextLink from "next/link";
import React, { Key, useEffect, useState } from "react";
import { chapters, ProgressLog, prettyPrintDate, ChapterLog, Chapter, sortLogs, chapterNameToChapter, chapterAmountMemorized, totalAmountMemorized } from '../../common/utils';
import { DocumentData, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";
import { CssVarsProvider, Box, Container, Breadcrumbs, Typography, ButtonGroup, Button, Link, Sheet, Input, Select, Option, Card, Divider, Chip, styled, LinearProgress, Grid, Tooltip, Modal, ModalClose, CardActions } from "@mui/joy";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    TablePagination,
    tablePaginationClasses as classes,
  } from '@mui/base/TablePagination';

const ViewProgress: NextPage = (): JSX.Element => {
    const [user, loading, error] = useAuthState(auth);
    const [filterText, setFilterText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [logs, setLogs] = useState<Array<DocumentData>>();
    const [chapterLogs, setChapterLogs] = useState<Array<DocumentData>>();
    const [sortOption, setSortOption] = useState('alphabetical');
    const [overallProgress, setOverallProgress] = useState<number>(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const [currentLog, setCurrentLog] = useState<ProgressLog | undefined>();

    useEffect(() => {
        const downloadProgressLogs = () => {
            let arr: DocumentData[] = [];
            if(user) {
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
            if(user) {
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

    // Verify if count is correct
    useEffect(() => {
        if(chapterLogs){
            let parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs));
            let sum = parsedChapterLogs.reduce((previous, current) => {
                return previous + current.lastVerseCompleted;
            },0);
            setOverallProgress(totalAmountMemorized(sum));
        }
    },[chapterLogs]);

    
    if(loading){ return <LoadingPage /> }
    if(error) { return <ErrorPage /> }
    return (
        <CssVarsProvider>
            {(user) ? (
                <Box>
                    <Header />
                    <Container sx={{ mt: 3, mb: 5 }}>
                        <Box sx={{ mb: 2 }}>
                            <Breadcrumbs sx={{ px: 0 }}>
                                <Typography level='title-sm'>
                                    <NextLink href="/landing">Home</NextLink>
                                </Typography>
                                <Typography level='title-sm'>View Progress</Typography>
                            </Breadcrumbs>
                            <Typography level='h1' sx={{ mb: 1 }}>All Progress</Typography>
                            <Typography level='title-sm'>
                            View all progress logs of memorization/revision. Track any new progress <NextLink href='/progress/track-progress'>here.</NextLink>           
                            </Typography>
                        </Box>

                        {/* Temporary Fix */}
                        <Box sx={{ display: {xs: 'inherit', sm: 'none'}}}>
                            <ButtonGroup 
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
                                orientation='vertical'>
                                <Button>
                                    <NextLink href='/progress/view-recent-progress'>
                                        <Link overlay>
                                            <Typography>Recent Progress</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography>All Progress</Typography>
                                </Button>
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ display: {xs: 'none', sm: 'inherit'}}}>
                            <ButtonGroup    
                                sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
                                orientation='horizontal'>
                                <Button>
                                    <NextLink href='/progress/view-recent-progress'>
                                        <Link overlay>
                                            <Typography>Recent Progress</Typography>
                                        </Link>
                                    </NextLink>
                                </Button>
                                <Button variant='soft' sx={{ cursor: 'default' }}>
                                    <Typography>All Progress</Typography>
                                </Button>
                            </ButtonGroup>
                        </Box>
                        
                        <Grid container sx={{ gap: 2, p: 0, m: 0 }}>
                            <AllProgressTable 
                                logs={logs ?? []}
                                filterText={filterText}
                                setFilterText={setFilterText} 
                                setSortOption={setSortOption}
                                sortOption={sortOption}
                                page={page}
                                setPage={setPage}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                                openModal={openModal}
                                setOpenModal={setOpenModal}
                                setCurrentLog={setCurrentLog}
                                currentLog={currentLog} />
                            <OverallProgress   
                                setSearchText={setSearchText}
                                searchText={searchText}
                                chapterLogs={chapterLogs ?? []} 
                                overallProgress={overallProgress} />
                        </Grid>
                    </Container>
                </Box>
            ) : ( 
                <Typography sx={{ p: 2 }}>You do not have access to this page. <NextLink href='/'>Return home.</NextLink></Typography>
            )}
        </CssVarsProvider>
    );
}

const AllProgressTable: React.FC<{ 
    logs: Array<DocumentData>, 
    filterText: string, 
    sortOption: string,
    setFilterText: (_: string) => void,
    setSortOption: (_: string) => void,
    page: number,
    setPage: (_:number) => void,
    rowsPerPage: number,
    setRowsPerPage: (_:number) => void,
    openModal: boolean,
    setOpenModal: (_:boolean) => void,
    setCurrentLog: (_:ProgressLog) => void,
    currentLog: ProgressLog | undefined
}> = ({ 
    logs, 
    filterText, 
    setFilterText, 
    setSortOption, 
    sortOption,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    openModal,
    setOpenModal,
    setCurrentLog,
    currentLog,
}) => {
    
    const parsedLogs: Array<ProgressLog> = JSON.parse(JSON.stringify(logs));
    const filteredLogs = parsedLogs.filter(
        (log: ProgressLog) => log.data.chapterName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );
    const sortedLogs = sortLogs(sortOption, filteredLogs);

    return (
        <Grid xs={12} lg={7.5}>
            {/* TODO: Make loading appear */}
            {(logs) ? (
                <Sheet sx={{ p: 3, borderRadius: '10px' }} variant='outlined'> 
                    <Box sx={{ display: 'flex', alignItems:'center', py: 2,  gap: 3 }}>
                        {/* Disappear responsive */}
                        <Input 
                            sx={{ width: {xs: '100%', sm: 'auto'} }}
                            type='text'
                            placeholder='Search by chapter name:'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} />
                        <Select 
                            sx={{ display: {xs: 'none', sm: 'flex'}}}
                            placeholder='Sort by...'
                            onChange={(_, newValue) => setSortOption(newValue!.toString())}>
                            <Option value='alphabetical'>Chapter Name - Alphabetically</Option>
                            <Option value='verseAmount'>Verse Amount Completed</Option>
                            <Option value='memorization'>Reading Type - Memorization</Option>
                            <Option value='revision'>Reading Type - Revision</Option>
                            <Option value='createdAt'>Log Date</Option>
                        </Select>
                    </Box>
                    <Table 
                         page={page}
                         setPage={setPage}
                         rowsPerPage={rowsPerPage}
                         setRowsPerPage={setRowsPerPage}
                         sortedLogs={sortedLogs}
                         setOpenModal={setOpenModal}
                         setCurrentLog={setCurrentLog} /> 

                    <LogModal 
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        currentLog={currentLog} />
                </Sheet>
            ) : ( <Typography sx={{ p: 2 }}>Loading...</Typography> )}  
        </Grid>
    );
};

const Table: React.FC<{
    page: number,
    setPage: (_:number) => void,
    rowsPerPage: number,
    setRowsPerPage: (_:number) => void,
    sortedLogs: Array<ProgressLog>,
    setOpenModal: (_:boolean) => void,
    setCurrentLog: (_:ProgressLog) => void,
}> = ({
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortedLogs,
    setOpenModal,
    setCurrentLog
}) => {  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedLogs.length) : 0;
  
    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <Root sx={{ maxWidth: '100%', borderRadius: 6 }}>
        <table aria-label="custom pagination table">
            {(sortedLogs!.length > 0) ? (
                <>
                    <thead>
                        <tr>
                            <th>Chapter Name</th>
                            <th>Amount Completed</th>
                            <th>Reading Type</th>
                            <th>Log Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLogs.map((log: ProgressLog) => (
                            <tr key={log.id}>
                                <td>{log.data.chapterNumber}. {log.data.chapterName}</td>
                                <td>{log.data.verseAmount} verses</td>
                                <td>{log.data.readingType}</td>
                                <td>{prettyPrintDate(log.data.createdAt)}</td>
                                <td style={{ textAlign: 'center', cursor: 'pointer' }} 
                                    onClick={() => {
                                        setOpenModal(true);
                                        setCurrentLog(log);
                                    }}>
                                    <InfoOutlinedIcon />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                count={sortedLogs.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                    'aria-label': 'rows per page',
                                    },
                                    actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}/>
                        </tr>
                    </tfoot>
                </>
            ) : ( 
                <Box sx={{ py:4, textAlign: 'center' }}>
                    <Typography>No logs.</Typography>
                </Box>
            )}
        </table>
      </Root>
    );
};  

const LogModal: React.FC<{ 
    openModal: boolean, 
    setOpenModal: (_:boolean) => void, 
    currentLog: ProgressLog | undefined,
}> = ({ 
    openModal, 
    setOpenModal, 
    currentLog,
}) => {
    return (
        <Modal
            aria-labelledby="close-modal-title"
            open={openModal}
            onClose={() => { setOpenModal(false); }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Sheet
                variant="outlined"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    minWidth: 300,
                    borderRadius: 'md',
                    p: 3
                }}>
                <ModalClose variant="outlined" />
                <Typography
                    component="h2"
                    id="close-modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    sx={{
                        display: 'flex', 
                        alignItems: 'center'
                    }}>
                    Log Information
                </Typography>
                    {(currentLog) ? (
                        <>
                            <Box>
                                <Typography id="modal-desc" textColor="text.tertiary">
                                    Chapter: {currentLog.data.chapterName} ({currentLog.data.chapterNumber})
                                </Typography>
                                <Typography id="modal-desc" textColor="text.tertiary">
                                    Date Created: {prettyPrintDate(currentLog.data.createdAt)}
                                </Typography>
                                <Typography id="modal-desc" textColor="text.tertiary">
                                    Verse Range: {currentLog.data.chapterNumber}:{currentLog.data.startVerse} {' '}
                                    - {currentLog.data.chapterNumber}:{currentLog.data.endVerse} {' '}
                                    ({currentLog.data.verseAmount} verses)

                                </Typography>
                                <Typography id="modal-desc" textColor="text.tertiary">
                                    Reading Type: {currentLog.data.readingType}
                                </Typography>
                                <Typography id="modal-desc" textColor="text.tertiary">
                                    Archived: {(currentLog.data.archived) ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                               
                            <Tooltip title="Delete functionality coming soon." variant='soft'>
                                <Button 
                                    variant="outlined" 
                                    color="danger">
                                    Delete
                                </Button>
                            </Tooltip>
                        </>
                    ) : ( <>Loading...</> )}
            </Sheet>
        </Modal>
    );
};

const OverallProgress: React.FC<{ 
    setSearchText: (_: string) => void, 
    searchText: string,
    chapterLogs: Array<DocumentData>,
    overallProgress: number
}> = ({ setSearchText, searchText, chapterLogs, overallProgress }) => {

    const filteredChapters = chapters.filter(
        chapter => chapter.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );

    const parsedChapterLogs: Array<ChapterLog> = JSON.parse(JSON.stringify(chapterLogs)); // FIXME: Find better way to parse
    const chapterNumberToChapterLog = new Map(parsedChapterLogs.map((chapter: ChapterLog) => [chapter.number, chapter]));

    const LinkElement = styled(Link)({
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
        },
    });

    return (
        <Grid xs={12} lg={4}>
            <Card variant='outlined' sx={{ boxShadow: 'none', maxHeight: '90vh' }}>
                <Box sx={{ py: 2 }}>
                    <Typography level='h2' sx={{ mb: 2 }}>Overall Progress</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, py:1, boxSizing: 'border-box' }}>
                        <LinearProgress 
                            determinate 
                            value={overallProgress} />

                        <Typography level='title-sm'>{`${overallProgress}% memorized`}</Typography>
                    </Box>
                </Box>
                <Divider />

                <Box sx={{ py: 1 }}>
                    <Input 
                        type='text' 
                        placeholder='Search chapters here:'
                        onChange={e => setSearchText(e.target.value)} />
                </Box>

                <Divider />

                <Box sx={{ overflowY: 'scroll' }}>
                    {(filteredChapters.length > 0) ? (
                        <Box>
                            {filteredChapters.map((chapter, index) => (
                                <Box key={index + chapter.number + chapter.name}>
                                    <Box sx={{ py: 2, px: {xs: 1, sm: 2} }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography 
                                                level='title-lg'
                                                sx={{ fontSize: {xs: '1rem', sm: '1.3rem'} }}>
                                                    {chapter.number}. {chapter.name}
                                            </Typography>
                                            <Chip
                                                variant="soft">
                                                <NextLink 
                                                    href={{
                                                        pathname:"track-progress",
                                                        query: {
                                                            chapter: chapter.name
                                                        }}}>
                                                    <LinkElement overlay>
                                                        <Typography sx={{ fontSize: {xs: '.9rem', sm: '1rem'} }}>Track Progress</Typography>
                                                    </LinkElement>
                                                </NextLink>
                                            </Chip>
                                        </Box>
                                        <Typography level='title-sm' sx={{ mt: 2 }}>
                                            {(chapterNumberToChapterLog.get(chapter.number) !== undefined ? (
                                                'Last reviewed: ' + prettyPrintDate(chapterNumberToChapterLog.get(chapter.number)!.lastReviewed)  // Create lastReviewedDate for specific data on days and weeks
                                            ) : ( 'Never reviewed' ))}
                                        </Typography>

                                        {(chapterNumberToChapterLog.get(chapter.number) !== undefined ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, py: 2, boxSizing: 'border-box' }}>
                                                <LinearProgress 
                                                    determinate 
                                                    value={
                                                        parseInt(chapterAmountMemorized(chapterNumberToChapterLog.get(chapter.number)!.lastVerseCompleted, chapter.name, chapterNameToChapter))
                                                    } 
                                                />

                                                <Typography level='title-sm'>
                                                    {chapterAmountMemorized(chapterNumberToChapterLog.get(chapter.number)!.lastVerseCompleted, chapter.name, chapterNameToChapter)+ '% memorized'}
                                                </Typography>
                                            </Box>
                                        ) : ( '' ))}
                                    </Box>
                                    {(index !== filteredChapters.length-1) ? <Divider /> : <></> }
                                </Box>
                            ))}
                        </Box>
                    ) : ( <Typography sx={{ textAlign: 'center', py: 1 }}>No logs</Typography> )}
                </Box>
            </Card>
        </Grid>
    )
};

// For table
const grey = {
    200: '#d0d7de',
    800: '#32383f',
    900: '#24292f',
};
  
const Root = styled('div')(
    ({ theme }) => `
    table {
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      border-collapse: collapse;
      width: 100%;
    }
  
    td,
    th {
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      text-align: left;
      padding: 8px;
    }
  
    th {
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    }
    `,
);

const CustomTablePagination = styled(TablePagination)`
& .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    }
}

& .${classes.selectLabel} {
    margin: 0;
}

& .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
    margin-left: auto;
    }
}

& .${classes.spacer} {
    display: none;
}

& .${classes.actions} {
    display: flex;
    gap: 0.25rem;
}
`;


export default ViewProgress;