import React from 'react'
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchBar from './SearchBar.tsx';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';



interface NavBarProps {
    onSearch: (query: string) => void;
    goToCart: () => void;
    logoSrc?: string;
    logoClick?: () => void;
    showEditButton?: boolean
    onEdit?: () => void
    onMenuClick?: () => void
}

const NavBar = ({ onSearch, goToCart, logoSrc, logoClick, showEditButton, onEdit, onMenuClick }: NavBarProps) => {

    return (
        <AppBar position="fixed" sx={{ bgcolor: 'rgba(255, 235, 19, 1)' }}>

            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <IconButton onClick={onMenuClick} sx={{ padding: '0px' }}>
                    <MenuIcon sx={{ height: '35px', width: 'fit-content' }} />
                </IconButton>

                <Button disableRipple onClick={logoClick} sx={{ ':hover': { backgroundColor: 'transparent' }, padding: '0px' }} >
                    <img src={logoSrc} alt="logo" style={{ height: '15vh' }} />
                </Button>

                <Box sx={{ flexGrow: 0.9, display: 'flex', justifyContent: 'center', minWidth: 0, maxHeight: '50%' }}>
                    <SearchBar onSearch={onSearch} />
                </Box>

                {
                    showEditButton &&
                    <IconButton onClick={onEdit} sx={{ color: 'black' }}>
                        <EditIcon sx={{ height: '35px', width: 'fit-content' }} />
                    </IconButton>
                }

                <IconButton onClick={goToCart} sx={{ color: 'black' }}>
                    <ShoppingCartIcon sx={{ height: '35px', width: 'fit-content' }} />
                </IconButton>
            </Toolbar>
        </AppBar>

    )
}

export default NavBar