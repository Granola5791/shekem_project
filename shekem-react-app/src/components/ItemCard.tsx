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
    buttonText?: string
    image?: string
    AddToCart?: (selectCount: number) => void
}

const ItemCard = ({ buttonText, image, AddToCart }: ItemCardProps) => {
    const [selectCount, setSelectCount] = React.useState(0);

    return (
        <Card sx={{ width: '180px', height: '400px', border: '2px solid yellow' }}>
            <CardMedia>
                <img src={image} />
            </CardMedia>
            <CardContent>
                <Typography>
                    Lorem ipsum dolor sit amet consectetur sint.
                </Typography>
            </CardContent>
            <Box sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'rgb(239, 232, 26)',
                        ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' }
                    }}
                    onClick={() => AddToCart?.(selectCount)}
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