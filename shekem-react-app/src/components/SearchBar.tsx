import React from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    onSearch: (searchInput: string) => void
}


const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchInput, setSearchInput] = React.useState('');
    return (
        <Grid direction={'row'} sx={{ width: 'fit-content', height: 'fit-content', border: '1px solid black' }}>
            <TextField
                id="filled-search"
                placeholder="Search"
                type="search"
                size="small"
                sx={{ width: '30vw', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchInput)
                    }
                }}
            />
            <IconButton type="submit" aria-label="search" onClick={() => onSearch(searchInput)}>
                <SearchIcon />
            </IconButton>
        </Grid>

    )
}

export default SearchBar