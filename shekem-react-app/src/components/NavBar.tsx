import React from 'react'
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchBar from './SearchBar.tsx';
import Toolbar from '@mui/material/Toolbar';



interface NavBarProps {
    onSearch: (query: string) => void;
    goToCart: () => void;
    logoSrc?: string;
}

const NavBar = ({ onSearch, goToCart, logoSrc }: NavBarProps) => {

    return (
        <AppBar position="fixed" sx={{ bgcolor: 'rgba(255, 235, 19, 1)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <img src={logoSrc} alt="logo" style={{ height: '15vh' }} />

                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', minWidth: 0, maxHeight: '50%' }}>
                    <SearchBar onSearch={onSearch} />
                </Box>

                <IconButton onClick={goToCart} sx={{ color: 'black' }}>
                    <ShoppingCartIcon sx={{ height: '35px', width: 'fit-content' }} />
                </IconButton>
            </Toolbar>
        </AppBar>

    )
}

export default NavBar