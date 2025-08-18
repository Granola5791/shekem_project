import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { insertValuesToConstantStr } from '../utils/constants.ts';

interface CategoryProps {
    photosPaths: string
    name: string
    id: number
    onClick?: (id: number) => void
}

const Category = ({ photosPaths: photosPath = '', name, id, onClick }: CategoryProps) => {
    return (
        <Button onClick={() => onClick?.(id)}  sx={{ padding: '0px' }}>
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(255, 255, 0, 1)',
                    borderRadius: '10px',
                    width: '350px',
                    height: '400px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top text */}
                <Typography variant="h6" sx={{ textAlign: 'center', color: "black" }}>
                    {name}
                </Typography>

                {/* Spacer to push grid down */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Image Grid */}
                <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center">
                    {[...Array(4)].map((_, idx) => (
                        <Grid key={idx} sx={{border: '1px solid rgba(255, 255, 0, 0.35)'}}>
                            <img
                                src={insertValuesToConstantStr(photosPath, id, idx + 1)}
                                alt={name}
                                style={{  height: '150px', width: '150px' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Button>
    )
}

export default Category