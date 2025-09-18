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
    onDelete: (id: number) => void,
    onChangeQuantity: (id: number, selectCount: number) => void,
    itemTitle: string,
    price: number,
    quantity: number,
    quantityLabel: string,
    stock: number,
    stockLabel: string,
    moneySymbol?: string
}


const CartItem = ({ id, photoPath, onDelete, itemTitle, price, quantity, quantityLabel, moneySymbol = "", onChangeQuantity, stock, stockLabel }: CartItemProps) => {

    const OnMinus = async () => {
        if (selectCount - 1) {
            setButtonDisabled(true);
            await onChangeQuantity(id, selectCount - 1);
            setSelectCount(selectCount - 1);
            setButtonDisabled(false);
        }
    }

    const OnPlus = async () => {
        if (selectCount < stock) {
            setButtonDisabled(true);
            await onChangeQuantity(id, selectCount + 1);
            setSelectCount(selectCount + 1);
            setButtonDisabled(false);
        }
    }

    const [selectCount, setSelectCount] = React.useState(quantity);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);

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
                        {price.toFixed(2)} {moneySymbol}
                    </Typography>
                    <Box className='select-count-container' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography>
                            {quantityLabel}
                        </Typography>

                        <IconButton disabled={buttonDisabled} onClick={OnPlus}>
                            <AddIcon />
                        </IconButton>

                        {selectCount}

                        <IconButton disabled={buttonDisabled} onClick={OnMinus}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>

                    <Typography variant='caption'>
                        {stockLabel}: {stock}
                    </Typography>
                </Box>

                <IconButton disabled={buttonDisabled} onClick={() => onDelete(id)} sx={{ position: 'absolute', top: 0, left: 0 }}>
                    <DeleteIcon />
                </IconButton>

            </Card>
        </>
    )
}

export default CartItem