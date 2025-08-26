import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'


interface CartItemProps {
    id: number,
    photoPath: string,
    onDelete: () => void,
    itemTitle: string,
    price: number,
    quantity: number,
    quantityLabel: string,
    moneySymbol?: string
}


const CartItem = ( { id, photoPath, onDelete, itemTitle, price, quantity, quantityLabel, moneySymbol = "" }: CartItemProps) => {

    const [selectCount, setSelectCount] = React.useState(quantity);

    return (
        <>
            <Card sx={{ display: 'flex', position: 'relative', gap: 3, padding: '10px' }}>
                <CardMedia
                    component="img"
                    sx={{ width: '100px', height: '100px' }}
                    image={photoPath}
                    alt="Item"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 'calc(100% - 150px)' }}>
                    <Typography sx={{ height: '1.5em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' }}>
                        {itemTitle}
                    </Typography>
                    <Typography fontWeight={'bold'}>
                        {price} {moneySymbol}
                    </Typography>
                    <Box className='select-count-container' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography>
                            {quantityLabel}
                        </Typography>

                        <IconButton onClick={() => { setSelectCount(selectCount + 1) }}>
                            <AddIcon />
                        </IconButton>

                        {selectCount}

                        <IconButton onClick={() => { (selectCount - 1) && setSelectCount(selectCount - 1) /*can't go below 1*/ }}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                </Box>

                <IconButton onClick={onDelete} sx={{ position: 'absolute', top: 0, left: 0 }}>
                    <DeleteIcon />
                </IconButton>

            </Card>
        </>
    )
}

export default CartItem