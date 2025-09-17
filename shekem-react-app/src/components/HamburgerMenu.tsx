import React from 'react'
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/List';
import Button from '@mui/material/Button';


interface HamburgerMenuProps {
    isOpen: boolean;
    itemTitles: string[];
    itemFunctions: (() => void)[];
    bgColor?: string;
}

const HamburgerMenu = ({ isOpen, itemTitles, itemFunctions, bgColor }: HamburgerMenuProps) => {
    return (
        <Drawer anchor="right" open={isOpen} onClose={() => { }} slotProps={{ paper: { sx: { backgroundColor: bgColor ? bgColor : 'white' } } }}>
            <List sx={{ width: '200px' }}>
                {itemTitles.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <Button onClick={itemFunctions[index]} sx={{ width: '100%' }}>
                            <ListItemText primary={text} />
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Drawer >
    )
}

export default HamburgerMenu