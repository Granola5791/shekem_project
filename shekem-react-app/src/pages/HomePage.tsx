import React, { use, useEffect, useState } from 'react'
import { AppBar, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ItemCard from '../components/ItemCard';
import { parse, stringify } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import SearchBar from '../components/SearchBar.tsx';


type Config = {
    add_to_cart_button: string
    shekel_symbol: string
    search_bar_text: string
}

type Item = {
    id: number;
    name: string;
    photoPath: string;
    price: number;
};

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

const fetchItem = async () => {
    const res = await fetch('http://localhost:8081/api/get_recommended_items', {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch items");
    const data = await res.json();
    return data.recommendedItems;
};

const fetchConfig = async () => {
    const res = await fetch('src/constants/hebrew.yaml');
    const text = await res.text();
    return parse(text);
};

function Search(searchInput: string) {

}


const HomePage = () => {
    const [config, setConfig] = React.useState<Config | null>(null);
    const [recommendedItems, setRecommendedItems] = useState<Item[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [items, config] = await Promise.all([fetchItem(), fetchConfig()]);
                setRecommendedItems(items);
                setConfig(config);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (error) return <p>{error}</p>;
    if (!config || loading || !recommendedItems) return <p>Loading...</p>;






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
                    {recommendedItems.map((item) => <ItemCard
                        key={item.id}
                        id={item.id}
                        itemTitle={item.name}
                        price={item.price}
                        moneySymbol={config.shekel_symbol}
                        buttonText={config.add_to_cart_button}
                        image={item.photoPath}
                        AddToCart={AddToCart}
                    />)}
                </Grid>
            </Container >
        </>
    )
}

export default HomePage
