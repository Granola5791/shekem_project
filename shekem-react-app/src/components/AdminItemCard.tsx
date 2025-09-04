import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface AdminItemCardProps {
    image: string;
    itemTitle: string;
    itemID: number;
    itemIDLabel: string;
    price: number;
    moneySymbol: string;
    stock: number;
    stockLabel: string;
    buttonText: string;
    onEdit: (id: number) => void
}

const AdminItemCard = ({ image, itemTitle, itemID, itemIDLabel, price, moneySymbol, stock, stockLabel, buttonText, onEdit }: AdminItemCardProps) => {
    return (
        <Card sx={{ width: '180px', height: '335px', border: '2px solid rgba(255, 251, 123, 0.8)', padding: '10px', boxShadow: '10px 10px 5px 0px rgba(0, 0, 0, 0.17)' }}>

            <CardMedia
                component="img"
                image={image}
                alt="item"
                height="150px"
                sx={{ marginBottom: '0px' }}
            />

            <Divider sx={{ marginY: '4px' }}></Divider>

            <CardContent sx={{ padding: 0, height: '130px' }}>
                <Typography variant="body1" sx={{ height: '40px', textAlign: 'center', overflow: 'hidden' }} >
                    {itemIDLabel}: {itemID}
                </Typography>

                <Divider/>

                <Typography variant="body1" sx={{ height: '65px', textAlign: 'center', overflow: 'hidden' }} >
                    {itemTitle}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: 'fit-content' }}>
                    <Typography variant="h6" sx={{ color: 'rgb(239, 232, 26)', fontWeight: 'bold' }}>
                        {price} {moneySymbol}
                    </Typography>

                    <Typography variant="body2">
                        {stockLabel}: {stock}
                    </Typography>
                </Box>
            </CardContent>

            <Divider sx={{ backgroundColor: 'rgba(255, 251, 123, 0.8)', marginY: '4px' }} />

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'rgb(239, 232, 26)',
                        ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' },
                        width: '100%'
                    }}
                    onClick={() => onEdit(itemID)}
                >
                    {buttonText}
                </Button>
            </Box>
        </Card>
    )
}

export default AdminItemCard