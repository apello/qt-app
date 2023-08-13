import React, { useState, useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Box, Typography, Button, IconButton, Alert } from "@mui/joy";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { User, updateProfile } from "firebase/auth";
import { storage } from "@/firebase/clientApp";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendIcon from '@mui/icons-material/Send';

const Dropzone: React.FC<{ user: User }> = ({ user }): JSX.Element => {
    const [files, setFiles] = useState<Array<Blob>>([]);
    const [rejected, setRejected] = useState<Array<FileRejection>>([]);
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    // Add files to respective useState arrays
    const onDrop = useCallback((acceptedFiles: Array<File>, rejectedFiles: Array<FileRejection>) => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles,
            ]);
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
        }
    }, []);

    // Dropzone configurations.
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        maxFiles:1
    })

    // TODO: Removes duplicate
    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }


    const handleUpload = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();

        const file = files[0]; // Dropdown disabled after one file is uploaded
        if(user && files) {
            setLoading(true);
            await uploadBytes(ref(storage, `${user.uid}.png`), file)
                .then(() => {
                    getDownloadURL(ref(storage, `${user.uid}.png`))
                        .then((photoURL) => {
                            updateProfile(user, { 
                                displayName: user.displayName,
                                photoURL: photoURL
                            })
                                .then(() => {
                                    setAlert('Successfully updated profile picture!');
                                    setOpenAlert(true);
                                    removeAll();
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    setLoading(false);
                                    setAlert(`Error updating profile picture: ${error}`);
                                    setOpenAlert(true);
                                    console.log(`Could not set photo URL: ${error}`)
                                })
                        })  
                        .catch((error) => {
                            setLoading(false);
                            setAlert(`Error updating profile picture: ${error}`);
                            setOpenAlert(true);
                            console.log(`Download failed: ${error}`);
                        })
                })
                .catch((error) => {
                    setLoading(false);
                    setAlert(`Error updating profile picture: ${error}`);
                    setOpenAlert(true);
                    console.log(`Upload failed: ${error}`)
                })
        }
    };


    return (
        <Box sx={{ p: 2 }}>
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

            <form onSubmit={handleUpload}>
                <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
                    {(rejected.length || !files.length) ? ( 
                        <Button type="submit" variant="outlined" endDecorator={<DriveFolderUploadIcon />} disabled>Upload</Button> 
                    ) : ( 
                        (!loading) ? (
                            <Button type="submit" variant="outlined" endDecorator={<DriveFolderUploadIcon />}>Upload</Button>
                        ) : (
                            <Button
                            loading
                            loadingPosition="end"
                            endDecorator={<SendIcon />}
                            variant="solid"
                            >
                                Upload
                            </Button>
                        )
                    )}
                </Box>
                <Box
                    {...getRootProps()}
                    sx={{ border: "1px solid #AEAEAE", textAlign: "center", borderStyle: "dashed", p: 8, borderRadius: "10px", cursor: "pointer" }}>
                    <input {...getInputProps()} disabled={files.length === 1}/>
                    {isDragActive ? (
                        <Typography level='title-sm' sx={{ m: 4 }}>Drop the files here ...</Typography> 
                    ) : (
                        <Typography level='title-sm'>Drop image here, or click to select image.</Typography>
                    )}
                </Box>
                <Box sx={{ pt: 3 }}>
                    {files.map((file: Blob, index: number) =>
                        <div key={file.name+index}>
                            <Typography level='title-sm' fontWeight='bold' sx={{ display: 'inline-block', my:1, mr: 2 }}>{file.name}</Typography>
                            <Button 
                                onClick={() => removeFile(file.name)}
                                sx={{ display: 'inline-block'}}
                                color='danger'
                                size="sm"
                                variant='outlined'>
                                    Delete
                            </Button>
                        </div>
                    )}

                    {rejected.map(({file, errors}, index) => 
                        <div key={file.name+index}>
                            <Typography level='title-sm' fontWeight='bold' sx={{ display: 'inline-block', my: 1, mr: 2 }}>{file.name}</Typography>
                            {errors.map((error: any) => (
                                <Typography level='title-sm' key={error.code} style={{ color: "red" }}>{error.message}</Typography>
                            ))}
                            <Button 
                                onClick={() => removeFile(file.name)}
                                sx={{ display: 'inline-block '}} 
                                color='danger'
                                size='sm'
                                variant='outlined'>
                                    Delete
                            </Button>
                        </div>
                    )}
                </Box>
            </form>
        </Box>
    )
};


export default Dropzone;