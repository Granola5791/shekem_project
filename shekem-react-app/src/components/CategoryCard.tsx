import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

interface CategoryProps {
    photosPaths: string[]
    name: string
    id: number
}

const Category = ({ photosPaths = [], name, id }: CategoryProps) => {
    return (
        <Button sx={{ padding: '0px' }}>
            <Box
                sx={{
                    bgcolor: 'rgba(255, 251, 123, 0.8)',
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
                <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center" sx={{ border: '1px solid black' }}>
                    {[...Array(4)].map((_, idx) => (
                        <Grid key={idx}>
                            <img
                                src={photosPaths[idx] || '/src/assets/bamba_item.jpg'} // Fallback image if no photo is available
                                alt={name}
                                style={{ maxHeight: '150px', maxWidth: '150px' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Button>
    )
}

export default Category