import React, { useEffect, useState } from 'react'
import { AppBar, Box, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { parse, stringify } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import SearchBar from '../components/SearchBar.tsx';
import { useNavigate } from 'react-router-dom';
import MyCategory from '../components/CategoryCard.tsx';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';




type HebrewConfig = {
    add_to_cart_button: string
    shekel_symbol: string
    search_bar_text: string
    category_list_title: string
}

type BackendConfig = {
    backend_address: string
    add_to_cart_api: string
    get_categories_api: string
    get_category_photo_api: string
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

}


const FetchCategories = async (backendConfig: BackendConfig) => {
    if (!backendConfig) {
        console.error("Backend configuration is not loaded.");
        return [];
    }
    const res = await fetch(backendConfig.backend_address + backendConfig.get_categories_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.categories;
}


const FetchHebrewConfig = async () => {
    const res = await fetch('src/constants/hebrew.yaml');
    const text = await res.text();
    return parse(text);
};

const FetchBackendConfig = async () => {
    const res = await fetch('src/constants/backend_api.yaml');
    const text = await res.text();
    return parse(text);
};

const HomePage = () => {
    const navigate = useNavigate();
    const [hebrewConfig, setHebrewConfig] = React.useState<HebrewConfig | null>(null);
    const [backendConfig, setBackendConfig] = React.useState<BackendConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {


        const fetchData = async () => {
            try {
                const [thisHebrewConfig, thisBackendConfig] = await Promise.all([FetchHebrewConfig(), FetchBackendConfig()]);
                setHebrewConfig(thisHebrewConfig);
                setBackendConfig(thisBackendConfig);
                if (!thisHebrewConfig || !thisBackendConfig) {
                    throw new Error("Failed to load configurations");
                }

                const thisCategories = await FetchCategories(thisBackendConfig);
                setCategories(thisCategories);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (error) return <p>{error}</p>;
    if (!hebrewConfig || loading) return <p>Loading...</p>;


    function SearchItems(searchInput: string) {
        navigate(`/search/?q=${searchInput}`);
    }

    function GoToCategory(id: number) {
        navigate(`/category/${id}`);
    }

    function GoToCart() {
        navigate('/cart');
    }

    async function AddToCart(id: number, selectCount: number) {
        if (selectCount <= 0) {
            return;
        }
        if (!backendConfig) {
            console.error("Backend configuration is not loaded.");
            return;
        }
        const res = await fetch(backendConfig.backend_address + backendConfig.add_to_cart_api, {
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

    return (
        <>
            <AppBar position='fixed' sx={{ height: '15vh', bgcolor: 'rgba(255, 235, 19, 1)' }}>
                <Grid container spacing={14} >
                    <Grid container direction="row" alignItems={"center"} sx={{ border: '1px solid black', width: '100%' }}>
                        <img
                            src="./src/assets/caveret-logo.svg"
                            alt="caveret-logo"
                            style={{ height: '15vh', width: 'fit-content' }}
                        />
                        <SearchBar onSearch={SearchItems} />
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            onClick={GoToCart}
                            sx={{ left: '30px', color: 'black', height: '50px', width: 'fit-content' }}
                        >
                            <ShoppingCartIcon sx={{ height: '35px', width: 'fit-content' }} />
                        </IconButton>
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
                    {hebrewConfig.category_list_title}
                </Typography>

                <Grid container spacing={2} columns={2} sx={{ justifyContent: 'center', width: '1000px' }}>
                    {categories.map((category) => (
                        <Grid key={category.id}>
                            <MyCategory
                                id={category.id}
                                name={category.name}
                                photosPaths={ backendConfig ? backendConfig.backend_address + backendConfig.get_category_photo_api : ''}
                                onClick={GoToCategory}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default HomePage
