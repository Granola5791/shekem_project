import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { parse } from 'yaml'
import { isUnauthorizedResponse } from '../utils/http.ts';
import MyCategory from '../components/CategoryCard.tsx';
import NavBar from '../components/NavBar.tsx';
import { useNavigation } from '../utils/navigation.ts';
import type { HebrewConstants, GeneralConstants, BackendConstants } from '../utils/constants.ts';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants.ts';


type Category = {
    id: number;
    name: string;
}


const FetchCategories = async (backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    if (!backendConstants) {
        console.error(generalConstants.errors.config_not_found);
        return [];
    }
    const res = await fetch(backendConstants.backend_address + backendConstants.get_categories_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.categories;
}

const HomePage = () => {
    // configs
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);

    // loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    // navigation functions
    const {
        searchItems: SearchItems,
        goToCategory: GoToCategory,
        goToCart: GoToCart,
        goToHome: GoToHome,
        goToLogin: GoToLogin
    } = useNavigation();


    useEffect(() => {


        const fetchData = async () => {
            try {
                const [thisHebrewConstants, thisBackendConstants, thisGeneralConstants] = await Promise.all([FetchHebrewConstants(), FetchBackendConstants(), FetchGeneralConstants()]);
                setHebrewConstants(thisHebrewConstants);
                setBackendConstants(thisBackendConstants);
                setGeneralConstants(thisGeneralConstants);
                if (!thisHebrewConstants || !thisBackendConstants || !thisGeneralConstants) {
                    throw new Error("Failed to load configurations");
                }

                const thisCategories = await FetchCategories(thisBackendConstants, thisGeneralConstants);
                setCategories(thisCategories);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (error) return <p>{'Something went wrong, try again later'}</p>;
    if (!hebrewConstants || !backendConstants || !generalConstants || loading) return <p>Loading...</p>;


    async function AddToCart(id: number, selectCount: number) {
        if (selectCount <= 0) {
            return;
        }
        if (!backendConstants) {
            console.error(generalConstants?.errors.config_not_found);
            return;
        }
        const res = await fetch(backendConstants.backend_address + backendConstants.add_to_cart_api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: id, quantity: selectCount }),
            credentials: 'include',
        });
        if (isUnauthorizedResponse(res)) {
            GoToLogin();
            return;
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
                    {hebrewConstants.category_list_title}
                </Typography>

                <Grid container spacing={2} columns={2} sx={{ justifyContent: 'center', width: '1000px' }}>
                    {categories.map((category) => (
                        <Grid key={category.id}>
                            <MyCategory
                                id={category.id}
                                name={category.name}
                                photosPaths={backendConstants ? backendConstants.backend_address + backendConstants.get_category_photo_api : ''}
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
