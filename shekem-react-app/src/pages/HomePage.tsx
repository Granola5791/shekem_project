import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { parse } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import MyCategory from '../components/CategoryCard.tsx';
import NavBar from '../components/NavBar.tsx';
import { useNavigation } from '../utils/navigation.ts';


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
    const [hebrewConfig, setHebrewConfig] = React.useState<HebrewConfig | null>(null);
    const [backendConfig, setBackendConfig] = React.useState<BackendConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const {
        searchItems: SearchItems,
        goToCategory: GoToCategory,
        goToCart: GoToCart,
        goToHome: GoToHome
    } = useNavigation();


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
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoSrc="./src/assets/caveret-logo.svg"
                logoClick={GoToHome}
            />


            <Container
                sx={{
                    height: '80vh',
                    marginTop: '17vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                                photosPaths={backendConfig ? backendConfig.backend_address + backendConfig.get_category_photo_api : ''}
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
