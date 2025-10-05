import React, { use, useContext, useEffect } from 'react'
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { insertValuesToConstantStr } from '../utils/constants';
import type { CartItemType } from '../utils/manageItems';
import CartItem from './CartItemCard';
import type { BackendConstants, HebrewConstants } from '../utils/constants';
import { useNavigation } from '../utils/navigation';
import Typography from '@mui/material/Typography';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    backendConstants: BackendConstants
    hebrewConstants: HebrewConstants
}

const FetchCartItems = async (backendConstants: BackendConstants) => {
    const res = await fetch(backendConstants.backend_address + backendConstants.get_cart_api, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data.cart;
}

const CartDrawer = ({ open, onClose, backendConstants, hebrewConstants }: CartDrawerProps) => {

    const [cartItems, setCartItems] = React.useState<CartItemType[]>([]);
    const { goToCart } = useNavigation();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cartItems = await FetchCartItems(backendConstants as BackendConstants);
                setCartItems(cartItems);
            } catch (error) {
                console.error(error);
            }
        };
        if (open) {
            fetchCartItems();
        } else {
            setCartItems([]);
        }
    }, [open]);

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

    const OnClose = () => {
        onClose();
        setCartItems([]);
    }


    if (!hebrewConstants || !backendConstants) {
        return <div>Loading...</div>;
    }
    return (
        <Drawer open={open} onClose={OnClose} >
            <Button onClick={goToCart} sx={{ bgcolor: 'rgba(255, 235, 19, 1)' }} >
                <Typography variant="h6" color='black'>{hebrewConstants.items.cart_title}</Typography>
            </Button>
            <Box sx={{ width: '350px', maxHeight: '90%', overflowY: 'auto', padding: '10px' }}>
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
        </Drawer >
    )
}

export default CartDrawer