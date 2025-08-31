import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { blue } from '@mui/material/colors'
import { Directions } from '@mui/icons-material'

interface PaginationControlsProps {
    pageCount: number
    currentPage: number
    goToPage: (page: number) => void
}

const PaginationControls = ({ pageCount, currentPage, goToPage }: PaginationControlsProps) => {
    return (
        <Box flexDirection={'row'} sx={{ direction: 'ltr' }}>
            {[...Array(pageCount)].map((_, index) => (
                <Button
                    key={index}
                    disabled={index === currentPage}
                    onClick={() => goToPage(index)}
                    sx={{ minWidth: '30px', color: (index === currentPage) ? 'rgba(255, 235, 19, 1)' : 'black' }}
                >
                    {index + 1}
                </Button>
            ))}
        </Box>
    )
}

export default PaginationControls