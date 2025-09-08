import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants'

const ManagementPage = () => {

    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants>()

    useEffect(() => {
        const fetchConstants = async () => {
            const hebrew = await FetchHebrewConstants();
            setHebrewConstants(hebrew);
        };
        fetchConstants();
    }, []);

    if(!hebrewConstants) {
        return <div>Loading...</div>;
    }

    return (
        <Container sx={{ height: '100vh', bgcolor: 'rgba(255, 130, 81, 0.69)' }}>
            <Link to="/home" style={{ position: 'absolute' }}>
                <img style={{ maxHeight: '200px', width: '200px' }} src="/photos/caveret-logo.svg" alt="logo" />
            </Link>
            <Box>
                <Typography variant='h4' align='center'>
                    {hebrewConstants.management.management_page_title}
                </Typography>
            </Box>

            <Box
                height={'100%'}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={2}
            >
                <Box
                    width={'200px'}
                    bgcolor={'rgba(255, 249, 60, 1)'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    border={'2px solid black'}
                    borderRadius={'10px'}
                >
                    <Link to="/manage/users" style={{ textDecoration: 'none', color: 'black' }}>
                        <Typography variant='h5'>
                            {hebrewConstants.management.manage_users}
                        </Typography>
                    </Link>
                </Box>
                <Box
                    width={'200px'}
                    bgcolor={'rgba(255, 249, 60, 1)'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    border={'2px solid black'}
                    borderRadius={'10px'}
                >
                    <Link to="/manage/items" style={{ textDecoration: 'none', color: 'black' }}>
                        <Typography variant='h5'>
                            {hebrewConstants.management.manage_items}
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Container >
    )
}

export default ManagementPage