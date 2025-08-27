import React, { use, useEffect, useState } from 'react'
import CartItem from '../components/CartItemCard'
import Container from '@mui/material/Container'
import type { BackendConstants, GeneralConstants, HebrewConstants } from '../utils/constants'
import { FetchGeneralConstants, FetchBackendConstants, FetchHebrewConstants, insertValuesToConstantStr } from '../utils/constants'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'
import Checkout from '../components/Checkout'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'


type CartItem = {
    itemID: number,
    quantity: number
    title: string,
    price: number,
    stock: number
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

const SubmitOrder = async (backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + backendConstants.submit_order_api, {
        method: 'POST',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.order_submit_fail + res.json());
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

        if (!res.ok) {
            throw new Error('Failed to update quantity');
        }

        setCartItems(prev =>
            prev.map(item =>
                item.itemID === itemID ? { ...item, quantity } : item
            )
        );

    }

    const SubmitOrder = async () => {
        if (!backendConstants || !generalConstants) {
            return;
        }
        const res = await fetch(backendConstants.backend_address + backendConstants.submit_order_api, {
            method: 'POST',
            credentials: 'include'
        });
        if (!res.ok) throw new Error(generalConstants.errors.order_submit_fail);
        window.location.reload();
    }


    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [backendConstants, setBackendConstants] = useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = useState<GeneralConstants | null>(null);
    const [hebrewConstants, setHebrewConstants] = useState<HebrewConstants | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const {
        searchItems: SearchItems,
        goToCart: GoToCart,
        goToHome: GoToHome
    } = useNavigation();


    useEffect(() => {
        setTotalPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, [cartItems]);


    if (!backendConstants || !generalConstants || !hebrewConstants) return <div>Loading...</div>;
    return (
        <>
            <NavBar
                logoSrc='/src/assets/caveret-logo.svg'
                onSearch={SearchItems}
                logoClick={GoToHome}
                goToCart={GoToCart}
            />

            <Container
                disableGutters
                maxWidth="md"
                sx={{
                    bgcolor: 'rgba(250, 250, 250, 1)',
                    display: 'flex',
                    height: '100vh',
                    padding: '10px',
                    marginTop: '15vh'
                }}
            >
                <Box sx={{ width: '50%', maxHeight: '90%', overflowY: 'auto', padding: '10px' }}>
                    <Stack spacing={2}>
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.itemID}
                                id={item.itemID}
                                quantity={item.quantity}
                                quantityLabel={hebrewConstants.items.quantity_label}
                                itemTitle={item.title}
                                price={item.price * item.quantity}
                                moneySymbol={hebrewConstants.items.money_symbol}
                                photoPath={
                                    backendConstants.backend_address +
                                    insertValuesToConstantStr(backendConstants.get_item_photo_api, item.itemID)
                                }
                                onDelete={DeleteItem}
                                onChangeQuantity={UpdateQuantity}
                                stock={item.stock}
                                stockLabel={hebrewConstants.items.stock_label}
                            />
                        ))}
                    </Stack>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 247, 0, 0.2)' }} />

                <Box sx={{ width: '50%', maxHeight: '90%', overflowY: 'auto', padding: '10px' }}>
                    {cartItems.length > 0 ? (
                        <Checkout
                            title={hebrewConstants.checkout.title}
                            priceLabel={hebrewConstants.checkout.price_label}
                            price={totalPrice}
                            moneySymbol={hebrewConstants.items.money_symbol}
                            buttonText={hebrewConstants.checkout.button_text}
                            onSubmit={SubmitOrder}
                        />)
                        :
                        <Typography variant="h4">{hebrewConstants.checkout.empty_cart_text}</Typography>
                    }
                </Box>
            </Container>
        </>
    )
}

export default CartPage