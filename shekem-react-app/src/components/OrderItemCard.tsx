import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ValueAndLable from './ValueAndLable';

interface OrderItemCardProps {
    id: number
    idLabel: string
    image: string
    title: string
    price: number
    priceLabel: string
    quantity: number
    quantityLabel: string
    moneySymbol: string
}

const OrderItemCard = ({ id, idLabel, image, title, price, priceLabel, quantity, quantityLabel, moneySymbol }: OrderItemCardProps) => {
    return (
        <Card sx={{ width: '250px', padding: '10px' }}>
            <CardMedia
                component="img"
                image={image}
                alt="item"
                sx={{ maxHeight: '150px', maxWidth: '250px' }}

            />
            <CardContent>
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
                    label={priceLabel}
                    value={price.toFixed(2) + moneySymbol}
                />

                <ValueAndLable
                    label={quantityLabel}
                    value={quantity}
                />

            </CardContent>
        </Card>
    )
}

export default OrderItemCard