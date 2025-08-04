import React, { use, useEffect } from 'react'
import { AppBar, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ItemCard from '../components/ItemCard';
import { parse, stringify } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import SearchBar from '../components/SearchBar.tsx';

async function AddToCart(id: number, selectCount: number) {
    const res = await fetch('http://localhost:8081/api/add_to_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: id, quantity: selectCount }),
        credentials: 'include',
    });
    if (isUnauthorizedResponse(res)) {
        throw new Response('Unauthorized', {
            status: 302,
            headers: { Location: '/login' },
        });
    }
}

function Search(searchInput: string) {

}

type config = {
    add_to_cart_button: string
    shekel_symbol: string
    search_bar_text: string
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
            <AppBar position='fixed' sx={{ height: '15vh', bgcolor: 'rgba(255, 235, 19, 1)' }}>
                <Grid container spacing={0} >
                    <Grid container direction="row" alignItems={"center"}>
                        <img
                            src="./src/assets/caveret-logo.svg"
                            alt="caveret-logo"
                            style={{ height: '15vh', width: 'fit-content' }}
                        />
                        <SearchBar onSearch={Search} />
                    </Grid>
                </Grid>
            </AppBar>
            <Container sx={{ height: '80vh', marginTop: '20vh' }}>
                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />
                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />
                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />                    <ItemCard
                        id={1}
                        itemTitle={"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        price={100}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image='src/assets/item_example.jpg'
                        AddToCart={AddToCart}
                    />
                </Grid>
            </Container >
        </>
    )
}

export default HomePage