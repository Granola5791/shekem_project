import React, { useEffect, useState } from 'react'
import OrderItemCard from '../components/OrderItemCard'
import Grid from '@mui/material/Grid'
import { FetchOrders } from '../utils/manageOrders'
import type { BackendConstants, GeneralConstants, HebrewConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants'
import type { Order } from '../utils/manageOrders'
import OrderCard from '../components/OrderCard'


const OrdersPage = () => {

    const [hebrewConstants, setHebrewConstants] = useState<HebrewConstants | null>(null)
    const [backendConstants, setBackendConstants] = useState<BackendConstants | null>(null)
    const [generalConstants, setGeneralConstants] = useState<GeneralConstants | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [orderCount, setItemCount] = useState(0)

    
    useEffect(() => {
        const fetchData = async () => {
            const [hebrewConstants, backendConstants, generalConstants] = await Promise.all([
                FetchHebrewConstants(),
                FetchBackendConstants(),
                FetchGeneralConstants(),
            ]);
            setHebrewConstants(hebrewConstants);
            setBackendConstants(backendConstants);
            setGeneralConstants(generalConstants);

            const [orders, orderCount] = await FetchOrders(backendConstants, generalConstants);
            setOrders(orders);
            setItemCount(orderCount);
        }

        fetchData();
    }, []);

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>Loading...</div>;
    }

    return (
        <Grid container spacing={2}>
            { orders.map((order) => (
                <Grid key={order.order_id} width={'80%'}>
                    <OrderCard
                        id={order.order_id}
                        orderItems={order.items}
                        total={order.total_price}
                        date={order.date}
                        hebrewConstants={hebrewConstants}
                        backendConstants={backendConstants}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default OrdersPage