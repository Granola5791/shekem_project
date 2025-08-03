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

interface ItemCardProps {
    id: number
    buttonText?: string
    image?: string
    itemTitle: string
    price: number
    AddToCart?: (id : number, selectCount: number) => void
}

const ItemCard = ({ id, buttonText = "add to cart", image, AddToCart, itemTitle, price}: ItemCardProps) => {
    const [selectCount, setSelectCount] = React.useState(0);

    return (
        <Card sx={{ width: '180px', height: '350px', border: '2px solid yellow', padding: '10px' }}>
            <CardMedia>
                <img src={image} />
            </CardMedia>

            <CardContent>
                <Typography variant="h6">
                    {itemTitle}
                </Typography>

                <Typography variant="h6">
                    {price}
                </Typography>
            </CardContent>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'rgb(239, 232, 26)',
                        ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' },
                        width: '90px'
                    }}
                    onClick={() => AddToCart?.(id, selectCount)}
                >
                    {buttonText}
                </Button>

                <IconButton onClick={() => { setSelectCount(selectCount + 1) }}>
                    <AddIcon />
                </IconButton>

                {selectCount}

                <IconButton onClick={() => { selectCount && setSelectCount(selectCount - 1) /*can't go below 0*/ }}>
                    <RemoveIcon />
                </IconButton>
            </Box>
        </Card>
    )
}

export default ItemCard