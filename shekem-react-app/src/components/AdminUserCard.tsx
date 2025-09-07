import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';


interface AdminUserCardProps {
    userID: number,
    userIDLabel: string,
    username: string,
    usernameLabel: string,
    privileges: string,
    privilegesLabel: string,
    createdAt: string,
    createdAtLabel: string,
    deleteButtonText: string,
    editButtonText: string,
    onDelete: (id: number) => void,
    onEdit: (id: number) => void
}

const AdminUserCard = ({ userID, userIDLabel, username, usernameLabel, privileges, privilegesLabel, createdAt, createdAtLabel, deleteButtonText, editButtonText, onDelete, onEdit }: AdminUserCardProps) => {
    return (
        <Card sx={{ padding: '10px', width: '180px', height: 'fit-content' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Box>
                    <label htmlFor="user-id">{userIDLabel}: </label>
                    <Typography id='user-id' variant="body1" fontWeight={'bold'} component="div">
                        {userID}
                    </Typography>
                </Box>
                <Box>
                    <label htmlFor="username">{usernameLabel}: </label>
                    <Typography id='username' variant="body1" fontWeight={'bold'} component="div">
                        {username}
                    </Typography>
                </Box>
                <Box>
                    <label htmlFor="privileges">{privilegesLabel}: </label>
                    <Typography id='privileges' variant="body1" fontWeight={'bold'} component="div">
                        {privileges}
                    </Typography>
                </Box>
                <Box>
                    <label htmlFor="created-at">{createdAtLabel}: </label>
                    <Typography id='created-at' variant="body1" fontWeight={'bold'} component="div">
                        {createdAt}
                    </Typography>
                </Box>
            </CardContent>
            <Box gap={0.5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    onClick={() => onEdit(userID)}
                    sx={{
                        backgroundColor: 'rgb(239, 232, 26)',
                        ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' },
                        width: '100%'
                    }}
                >
                    {editButtonText}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onDelete(userID)}
                    sx={{
                        backgroundColor: 'rgba(239, 26, 26, 1)',
                        ':hover': { backgroundColor: 'rgba(255, 0, 0, 1)' },
                        width: '100%'
                    }}
                >
                    {deleteButtonText}
                </Button>
            </Box>
        </Card>
    )
}

export default AdminUserCard