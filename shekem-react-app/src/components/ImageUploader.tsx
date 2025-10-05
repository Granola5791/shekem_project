import React from 'react'
import Input from '@mui/material/Input';


interface ImageUploaderProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileUrl: string | null;
}

const ImageUploader = ({ onChange, fileUrl }: ImageUploaderProps) => {

    return (
        <>
            <Input type="file" onChange={onChange} inputProps={{ accept: "image/*" }}></Input>
            {fileUrl && <img src={fileUrl} alt="" style={{ maxHeight: '150px', maxWidth: '150px' }} />}
        </>
    )
}

export default ImageUploader