import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Divider from '@mui/material/Divider';

interface ItemCardProps {
    id: number
    buttonText?: string
    image?: string
    itemTitle: string
    price: number
    moneySymbol?: string
    AddToCart?: (id: number, selectCount: number) => void
    stock: number
    stockLabel?: string
}

const ItemCard = ({ id, buttonText = "add to cart", image, AddToCart, itemTitle, price, moneySymbol = "$", stock, stockLabel }: ItemCardProps) => {

    const OnMinus = () => {
        if (selectCount > 0) {
            setSelectCount(selectCount - 1);
        }
    }

    const OnPlus = () => {
        if (selectCount < stock) {
            setSelectCount(selectCount + 1);
        }
    }

    const OnAddToCart = () => {
        setSelectCount(0);
        if (AddToCart) {
            AddToCart(id, selectCount);
        }
    }
    

    const [selectCount, setSelectCount] = React.useState(0);

    return (
        <Card sx={{ width: '180px', height: '350px', border: '2px solid rgba(255, 251, 123, 0.8)', padding: '10px', boxShadow: '10px 10px 5px 0px rgba(0, 0, 0, 0.17)' }}>

            <CardMedia
                component="img"
                image={image}
                alt="item"
                height="150px"
                sx={{ marginBottom: '0px' }}
            />

            <Divider sx={{ marginY: '4px' }}></Divider>

            <CardContent sx={{ padding: 0, height: '130px' }}>
                <Typography variant="body1" sx={{ height: '100px', textAlign: 'center', overflow: 'hidden' }} >
                    {itemTitle}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: 'fit-content' }}>
                    <Typography variant="h6" sx={{ color: 'rgb(239, 232, 26)', fontWeight: 'bold' }}>
                        {price.toFixed(2)} {moneySymbol}
                    </Typography>

                    <Typography variant="body2">
                        {stockLabel}: {stock}
                    </Typography>
                </Box>
            </CardContent>

            <Divider sx={{ backgroundColor: 'rgba(255, 251, 123, 0.8)', marginY: '4px' }} />

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'rgb(239, 232, 26)',
                        ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' },
                        width: '90px'
                    }}
                    onClick={OnAddToCart}
                    disabled={!selectCount}
                >
                    {buttonText}
                </Button>

                <IconButton onClick={OnPlus}>
                    <AddIcon />
                </IconButton>

                {selectCount}

                <IconButton onClick={OnMinus}>
                    <RemoveIcon />
                </IconButton>
            </Box>
        </Card>
    )
}

export default ItemCard