import React, { use, useEffect, useState } from 'react'
import CartItem from '../components/CartItemCard'
import Container from '@mui/material/Container'
import type { BackendConstants, GeneralConstants, HebrewConstants } from '../utils/constants'
import { FetchGeneralConstants, FetchBackendConstants, FetchHebrewConstants, insertValuesToConstantStr } from '../utils/constants'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'


type CartItem = {
    itemID: number,
    quantity: number
    title: string,
    price: number
}





const FetchCartItems = async (backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + backendConstants.get_cart_api, {
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
                const [thisBackendConstants, thisGeneralConstants, thisHebrewConstants] = await Promise.all([FetchBackendConstants(), FetchGeneralConstants(), FetchHebrewConstants()]);
                setBackendConstants(thisBackendConstants);
                setGeneralConstants(thisGeneralConstants);
                setHebrewConstants(thisHebrewConstants);
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

    const DeleteItem = (itemID: number) => {
        const DeleteFromBackend = async () => {
            if (!backendConstants) {
                return;
            }
            const res = await fetch(backendConstants.backend_address + backendConstants.delete_from_cart_api, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: itemID }),
                credentials: 'include',
            });
        }

        const DeleteFromFrontend = async () => {
            const newCartItems = cartItems.filter((item) => item.itemID !== itemID);
            setCartItems(newCartItems);
        }


        DeleteFromBackend();
        DeleteFromFrontend();
    };

    const UpdateQuantity = async (itemID: number, quantity: number) => {
        if (!backendConstants) {
            return;
        }
        const res = await fetch(backendConstants.backend_address + backendConstants.update_cart_item_quantity_api, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemID, quantity: quantity }),
            credentials: 'include',
        });
    }

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [backendConstants, setBackendConstants] = useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = useState<GeneralConstants | null>(null);
    const [hebrewConstants, setHebrewConstants] = useState<HebrewConstants | null>(null);


    if (!backendConstants || !generalConstants || !hebrewConstants) return <div>Loading...</div>;
    return (

        <Container disableGutters maxWidth="md" sx={{ display: 'flex', height: '100vh', border: '1px solid black', padding: '10px' }}>

            <Box sx={{ width: '50%', maxHeight: '90%', overflowY: 'auto', padding: '10px' }}>
                <Stack spacing={2}>
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.itemID}
                            id={item.itemID}
                            quantity={item.quantity}
                            quantityLabel={hebrewConstants.items.quantity_label}
                            itemTitle={item.title}
                            price={item.price}
                            moneySymbol={hebrewConstants.items.money_symbol}
                            onDelete={DeleteItem}
                            onChangeQuantity={UpdateQuantity}
                            photoPath={
                                backendConstants.backend_address +
                                insertValuesToConstantStr(backendConstants.get_item_photo_api, item.itemID)
                            }
                        />
                    ))}
                </Stack>
            </Box>
        </Container>

    )
}

export default CartPage