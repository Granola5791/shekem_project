import React, { use, useEffect } from 'react'
import { Container } from '@mui/material';
import ItemCard from '../components/ItemCard';
import { parse, stringify } from 'yaml'

function AddToCart(id: number, selectCount: number) {
    fetch('http://localhost:8081/api/add_to_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, selectCount }),
        credentials: 'include',
    });
}

type config = {
    add_to_cart_button: string
}

const HomePage = () => {
    const [config, setConfig] = React.useState<config | null>(null);

    useEffect(() => {
        fetch('src/constants/hebrew.yaml')
            .then(response => response.text())
            .then(text => setConfig(parse(text)));
    }, []);
    if (!config) return <p>Loading...</p>;

    return (
        <>
            <Container sx={{ height: '100vh' }}>
                <ItemCard
                    id={1}
                    itemTitle='מוצר'
                    price={100}
                    buttonText={config.add_to_cart_button}
                    image='src/assets/item_example.jpg'
                    AddToCart={AddToCart}
                />
            </Container >
        </>
    )
}

export default HomePage