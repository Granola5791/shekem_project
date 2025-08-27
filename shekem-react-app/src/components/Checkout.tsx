import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


interface CheckoutProps {
    title: string
    priceLabel: string
    price: number
    moneySymbol?: string
    buttonText?: string
    onSubmit?: () => void
}

const Checkout = ({ title, priceLabel, price, moneySymbol, buttonText, onSubmit }: CheckoutProps) => {

    const [disabled, setDisabled] = React.useState(false)

    const handleClick = async () => {
        setDisabled(true)
        await onSubmit?.()
        setDisabled(false)
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            bgcolor: 'rgba(255, 249, 80, 0.8)',
            border: '2px solid rgba(255, 249, 72, 1)',
            padding: '10px'
        }}>
            <Typography variant="h4">
                {title}
            </Typography>

            <Typography variant="h5">
                {priceLabel}: {price} {moneySymbol}
            </Typography>

            <Button
                variant="contained"
                sx={{
                    backgroundColor: 'rgb(239, 232, 26)',
                    ':hover': { backgroundColor: 'rgba(255, 247, 0, 1)' },
                    width: '150px',
                    height: '50px'
                }}
                onClick={handleClick}
                disabled={disabled}
            >
                {buttonText}
            </Button>
        </Box>
    )
}

export default Checkout