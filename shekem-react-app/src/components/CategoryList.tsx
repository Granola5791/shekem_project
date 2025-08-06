import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/Inbox'

export type Category = {
    name: string
    id: number
}

interface CategoryListProps {
    infos: Category[]
}


const CategoryList = ({ infos }: CategoryListProps) => {
    return (
        <>
            <List sx={{ width: '15%', height: '100%', right: 0, position: 'fixed', bgcolor: 'rgba(255, 190, 13, 0.82)'}}>
                {infos.map((info) => {
                    return (
                        <ListItem disablePadding key={info.id}>
                            <ListItemButton sx={{ textAlign: 'right', display: 'flex', gap: 1 }}>
                                <ListItemText primary={info.name} sx={{ margin: 0 }} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </>
    )
}

export default CategoryList