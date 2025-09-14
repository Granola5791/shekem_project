import React from 'react'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

interface OneButtonPopUpProps {
    open: boolean
    theme?: 'error' | 'info' | 'success' | 'warning'
    title?: string
    buttonText?: string
    onButtonClick?: () => void
    children?: React.ReactNode
}

const OneButtonPopUp = ({ open, theme = 'success', title = '', buttonText = 'OK', onButtonClick = () => { }, children }: OneButtonPopUpProps) => {

    return (
        <Dialog color='error' open={open} onClose={() => { }}>
            <Box padding={2} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                {title && <DialogTitle sx={{ textAlign: 'center' }}>{title}</DialogTitle>}
                {children && <Typography variant="body1" sx={{ padding: '16px', textAlign: 'center' }}>{children}</Typography>}
                <Button size='small' variant="contained" color={theme} onClick={onButtonClick}>{buttonText}</Button>
            </Box>
        </Dialog>
    )
}

export default OneButtonPopUp