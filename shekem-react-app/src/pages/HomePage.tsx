import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MyCategory from '../components/CategoryCard.tsx';
import NavBar from '../components/NavBar.tsx';
import { useNavigation } from '../utils/navigation.ts';
import type { HebrewConstants, GeneralConstants, BackendConstants } from '../utils/constants.ts';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants.ts';
import { IsAdmin } from '../utils/manageUsers.ts';
import OneButtonPopUp from '../components/OneButtonPopUp.tsx';
import HamburgerMenu from '../components/HamburgerMenu.tsx';
import Box from '@mui/material/Box';
import { Logout } from '../utils/logout.ts';
import { FetchCategories } from '../utils/categories.ts';
import type { Category } from '../utils/categories.ts';


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
    const [menuOpen, setMenuOpen] = useState(false);

    // navigation functions
    const {
        searchItems: SearchItems,
        goToCategory: GoToCategory,
        goToCart: GoToCart,
        goToHome: GoToHome,
        goToManagement: GoToManagement,
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

    const LogoutUser = async () => {
        const res = await Logout();
        if (!res.ok) {
            setOpenError(true);
            return;
        }
        GoToLogin();
    }

    return (
        <>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoSrc="./src/assets/caveret-logo.svg"
                logoClick={GoToHome}
                showEditButton={admin}
                onEdit={GoToManagement}
                onMenuClick={() => setMenuOpen(true)}
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

                <Box onClick={() => setMenuOpen(false)}>
                    <HamburgerMenu
                        isOpen={menuOpen}
                        topItemTitles={[hebrewConstants.go_to_home, hebrewConstants.go_to_cart]}
                        topItemFunctions={[GoToHome, GoToCart]}
                        bottomItemTitles={[hebrewConstants.logout]}
                        bottomItemFunctions={[LogoutUser]}
                        bgColor='rgba(255, 235, 19, 1)'
                    />
                </Box>
            </Container>
        </>
    )
}

export default HomePage
