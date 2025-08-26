import React, { use, useEffect, useState } from 'react'
import CartItem from '../components/CartItemCard'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import type { BackendConstants, GeneralConstants } from '../utils/constants'
import { FetchGeneralConstants, FetchBackendConstants } from '../utils/constants'


type CartItem = {
    itemID: number, 
    quantity: number
    title: string,
    price: number
}


const FetchCartItems = async (backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch( backendConstants.backend_address + backendConstants.get_cart_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.cart_load_fail);
    const data = await res.json();
    return data.cart;
}

const CartPage = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [thisBackendConstants, thisGeneralConstants] = await Promise.all([FetchBackendConstants(), FetchGeneralConstants()]);
                setBackendConstants(thisBackendConstants);
                setGeneralConstants(thisGeneralConstants);
                if (!thisBackendConstants || !thisGeneralConstants) {
                    throw new Error("Failed to load configurations");
                }
                const thisCartItems = await FetchCartItems(thisBackendConstants, thisGeneralConstants);
                setCartItems(thisCartItems);
            } catch (err: any) {
                console.error(err.message);
            }
        }
        fetchData();
    }, []);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [backendConstants, setBackendConstants] = useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = useState<GeneralConstants | null>(null);


    if (!backendConstants || !generalConstants) return <div>Loading...</div>;
    return (

        <Container disableGutters maxWidth="md" sx={{ height: '100vh', border: '1px solid black', padding: '10px' }}>
            <Grid >
            </Grid>
        </Container>

    )
}

export default CartPage