import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface ValueAndLableProps {
    value: string | number,
    label: string,
}

const ValueAndLable = ({ value, label }: ValueAndLableProps) => {
    return (
        <>
            <Divider />

            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'baseline'}
                height={'fit-content'}
            >
                <Typography
                    variant="h6"
                >
                    {label}:
                </Typography>

                <Typography
                    variant="body1"
                >
                    {value}
                </Typography>
            </Box>
        </>
    )
}

export default ValueAndLable