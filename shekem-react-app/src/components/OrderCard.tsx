import type { OrderItem } from '../utils/manageOrders'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import OrderItemCard from './OrderItemCard';
import type { HebrewConstants, BackendConstants } from '../utils/constants';
import { insertValuesToConstantStr } from '../utils/constants';

interface OrderCardProps {
    id: number
    orderItems: OrderItem[]
    total: number
    date: string
    hebrewConstants: HebrewConstants
    backendConstants: BackendConstants
}

const OrderCard = ({ id, orderItems, total, date, hebrewConstants, backendConstants }: OrderCardProps) => {
    return (
        <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowX: 'auto' }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {hebrewConstants.orders.order_id}: {id}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                    <Stack direction={'row'} spacing={2}>
                        {orderItems.map((orderItem) => <OrderItemCard
                            key={orderItem.item_id}
                            id={orderItem.item_id}
                            title={orderItem.item_name}
                            price={orderItem.price}
                            quantity={orderItem.quantity}
                            moneySymbol={hebrewConstants.shekel_symbol}
                            idLabel={hebrewConstants.items.item_id_label}
                            priceLabel={hebrewConstants.items.price_label}
                            quantityLabel={hebrewConstants.items.quantity_label}
                            image={
                                backendConstants.backend_address +
                                insertValuesToConstantStr(backendConstants.get_item_photo_api, orderItem.item_id)
                            }
                        />)}
                    </Stack>
                </Box>
                <Divider />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {hebrewConstants.orders.order_date}: {date}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {hebrewConstants.checkout.price_label}: {total.toFixed(2)} {hebrewConstants.shekel_symbol}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default OrderCard