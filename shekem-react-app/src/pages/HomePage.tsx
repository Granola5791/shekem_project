import React, { useEffect, useState } from 'react'
import { AppBar, Box, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { parse, stringify } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import SearchBar from '../components/SearchBar.tsx';
import { useNavigate } from 'react-router-dom';
import MyCategory from '../components/CategoryCard.tsx';


type Config = {
    add_to_cart_button: string
    shekel_symbol: string
    search_bar_text: string
    category_list_title: string
}

type Item = {
    id: number;
    name: string;
    photoPath: string;
    price: number;
};

type Category = {
    id: number;
    name: string;
    photosPaths: string[];
}


async function AddToCart(id: number, selectCount: number) {
    if (selectCount <= 0) {
        return;
    }
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

const FetchCategories = async () => {
    const res = await fetch('http://localhost:8081/api/get_categories', {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.categories;
}

const fetchConfig = async () => {
    const res = await fetch('src/constants/hebrew.yaml');
    const text = await res.text();
    return parse(text);
};


const HomePage = () => {
    const navigate = useNavigate();
    const [config, setConfig] = React.useState<Config | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [config, categories] = await Promise.all([fetchConfig(), FetchCategories()]);
                setCategories(categories);
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
    if (!config || loading) return <p>Loading...</p>;


    function SearchItems(searchInput: string) {
        navigate(`/search/?q=${searchInput}`);
    }


    return (
        <>
            <AppBar position='fixed' sx={{ height: '15vh', bgcolor: 'rgba(255, 235, 19, 1)' }}>
                <Grid container spacing={14} >
                    <Grid container direction="row" alignItems={"center"}>
                        <img
                            src="./src/assets/caveret-logo.svg"
                            alt="caveret-logo"
                            style={{ height: '15vh', width: 'fit-content' }}
                        />
                        <SearchBar onSearch={SearchItems} />
                    </Grid>
                </Grid>
            </AppBar>

            <Container
                sx={{
                    height: '80vh',
                    marginTop: '17vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // for centering horizontally
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: '20px', color: 'black' }}>
                    {config.category_list_title}
                </Typography>

                <Grid container spacing={2} columns={2} sx={{ justifyContent: 'center', width: '1000px' }}>
                    {categories.map((category) => (
                        <Grid key={category.id}>
                            <MyCategory
                                id={category.id}
                                name={category.name}
                                photosPaths={category.photosPaths}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default HomePage
