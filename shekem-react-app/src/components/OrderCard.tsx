import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ValueAndLable from './ValueAndLable';

interface OrderCardProps {
    id: number
    idLabel: string
    image: string
    title: string
    totalPrice: number
    totalPriceLabel: string
    quantity: number
    quantityLabel: string
    date: string
    dateLabel: string
    moneySymbol: string
}

const OrderCard = ({ id, idLabel, image, title, totalPrice, totalPriceLabel, quantity, quantityLabel, date, dateLabel, moneySymbol }: OrderCardProps) => {
    return (
        <Card sx={{ width: '250px' }}>
            <CardMedia
                component="img"
                image={image}
                alt="item"
                sx={{ maxHeight: '150px', maxWidth: '250px' }}

            />
            <CardContent sx={{ padding: 1 }}>
                <Typography
                    variant="body1"
                    height={'40px'}
                    textAlign={'center'}
                    overflow={'hidden'}
                >
                    {title}
                </Typography>

                <ValueAndLable
                    label={idLabel}
                    value={id}
                />

                <ValueAndLable
                    label={totalPriceLabel}
                    value={totalPrice.toFixed(2) + moneySymbol}
                />

                <ValueAndLable
                    label={quantityLabel}
                    value={quantity}
                />

                <ValueAndLable
                    label={dateLabel}
                    value={date}
                />

            </CardContent>
        </Card>
    )
}

export default OrderCard