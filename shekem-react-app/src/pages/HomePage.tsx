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
import { IsAdmin } from '../utils/manageUsers.ts';
import OneButtonPopUp from '../components/OneButtonPopUp.tsx';


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

    // loading state
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState<Category[]>([]);
    const [admin, setAdmin] = useState(false);
    const [openError, setOpenError] = React.useState(false);

    // navigation functions
    const {
        searchItems: SearchItems,
        goToCategory: GoToCategory,
        goToCart: GoToCart,
        goToHome: GoToHome,
        goToManagement: GoToManagement
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
                const isAdmin = await IsAdmin(thisBackendConstants, thisGeneralConstants);
                setAdmin(isAdmin);
            } catch (err: any) {
                setOpenError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (!hebrewConstants || !backendConstants || !generalConstants || loading) return <p>Loading...</p>;


    return (
        <>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoSrc="./src/assets/caveret-logo.svg"
                logoClick={GoToHome}
                showEditButton={admin}
                onEdit={GoToManagement}
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
                <OneButtonPopUp
                    open={openError}
                    theme='error'
                    buttonText={hebrewConstants.ok}
                    onButtonClick={() => setOpenError(false)}
                >
                    {hebrewConstants.user_errors.generic_error}
                </OneButtonPopUp>
            </Container>
        </>
    )
}

export default HomePage
