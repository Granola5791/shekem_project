import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/Inbox'

export type CategoryInfo = {
    names: string
    IDs: number
}

interface CategoryListProps {
    infos: CategoryInfo[]
}


const CategoryList = ({ infos }: CategoryListProps) => {
    return (
        <>
            <List sx={{ width: '15%', right: 0, position: 'fixed' }}>
                {infos.map((info) => {
                    return (
                        <ListItem disablePadding key={info.IDs}>
                            <ListItemButton sx={{ textAlign: 'right', display: 'flex', gap: 1 }}>
                                <ListItemText primary={info.names} sx={{ margin: 0 }} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </>
    )
}

export default CategoryList