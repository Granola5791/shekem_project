import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import ItemCard from '../components/ItemCard'
import type { Item } from '../utils/manageItems'
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { isUnauthorizedResponse } from '../utils/http'
import PaginationControls from '../components/PaginationControls'
import OneButtonPopUp from '../components/OneButtonPopUp'
import Box from '@mui/material/Box'
import HamburgerMenu from '../components/HamburgerMenu'
import { Logout } from '../utils/logout'

const FetchCategoryItemsPage = async (categoryID: number, page: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_category_items_page_api, categoryID, page), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.items;
}

const FetchCategoryItemsCount = async (categoryID: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_category_items_count_api, categoryID), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.count;
}

const FetchCategoryName = async (categoryID: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_category_name_api, categoryID), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.name;
}

const CategoryPage = () => {


    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = React.useState<string>(searchParams.get('p') || '1');
    const [items, setItems] = React.useState<Item[]>([]);
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);
    const [itemCount, setItemCount] = React.useState(0);
    const [categoryName, setCategoryName] = React.useState('');
    const [openError, setOpenError] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const { state } = useLocation();
    const isAdmin = state?.role === 'admin';
    const {
        goToHome: GoToHome,
        goToCart: GoToCart,
        searchItems: SearchItems,
        goToLogin: GoToLogin,
        goToOrders: GoToOrders,
        goToManagement: GoToManagement,
    } = useNavigation(isAdmin);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                throw new Error("Failed to load category");
            }

            try {
                const [thisBackendConstants, thisGeneralConstants, thisHebrewConstants] = await Promise.all([FetchBackendConstants(), FetchGeneralConstants(), FetchHebrewConstants()]);
                setBackendConstants(thisBackendConstants);
                setGeneralConstants(thisGeneralConstants);
                setHebrewConstants(thisHebrewConstants);
                if (!thisBackendConstants || !thisGeneralConstants) {
                    throw new Error("Failed to load configurations");
                }
                const thisItemCount = await FetchCategoryItemsCount(parseInt(id), thisBackendConstants, thisGeneralConstants);
                const thisItems = await FetchCategoryItemsPage(parseInt(id), parseInt(page), thisBackendConstants, thisGeneralConstants);
                const thisCategoryName = await FetchCategoryName(parseInt(id), thisBackendConstants, thisGeneralConstants);
                setCategoryName(thisCategoryName);
                setItemCount(thisItemCount);
                setItems(thisItems);

            } catch (err: any) {
                setOpenError(true);
            }
        }
        fetchData();
    }, [page])

    const GoToPage = (page: number) => {
        setSearchParams({ p: (page + 1).toString() });
        setPage((page + 1).toString());
    }

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
            body: JSON.stringify({ item_id: id, quantity: selectCount }),
            credentials: 'include',
        });
        if (isUnauthorizedResponse(res)) {
            GoToLogin();
            return;
        }
        if (!res.ok) {
            setOpenError(true);
            return;
        }
    }
    const LogoutUser = async () => {
        const res = await Logout();
        if (!res.ok) {
            setOpenError(true);
            return;
        }
        GoToLogin();
    }

    if (!hebrewConstants || !backendConstants || !generalConstants || !items) {
        return <>loading</>
    }

    return (
        <Container maxWidth={false} sx={{ bgcolor: '#ffeb13' }}>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoClick={GoToHome}
                logoSrc='\photos\caveret-logo.svg'
                onMenuClick={() => setMenuOpen(true)}
                showEditButton={isAdmin}
                onEdit={GoToManagement}
            />
            <Container
                maxWidth="md"
                sx={{
                    bgcolor: 'rgba(250, 250, 250, 1)',
                    padding: '10px',
                    marginTop: '15vh',
                    minHeight: '100vh',
                }}
            >
                <Typography variant="h4" gutterBottom textAlign={'center'}>
                    {categoryName}
                </Typography>

                <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center">
                    {items.map((item: Item) => (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            itemTitle={item.name}
                            price={item.price}
                            stock={item.stock}
                            buttonText={hebrewConstants.items.add_to_cart_button}
                            moneySymbol={hebrewConstants.items.money_symbol}
                            stockLabel={hebrewConstants.items.stock_label}
                            image={backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_item_photo_api, item.id)}
                            AddToCart={AddToCart}
                        />
                    ))}
                </Grid>

                {
                    itemCount > generalConstants.items_per_page &&
                    <PaginationControls
                        pageCount={Math.ceil(itemCount / generalConstants.items_per_page)}
                        currentPage={parseInt(page) - 1}
                        goToPage={GoToPage}
                    />
                }

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
                        topItemTitles={[hebrewConstants.go_to_home, hebrewConstants.go_to_cart, hebrewConstants.go_to_orders]}
                        topItemFunctions={[GoToHome, GoToCart, GoToOrders]}
                        bottomItemTitles={[hebrewConstants.logout]}
                        bottomItemFunctions={[LogoutUser]}
                        bgColor='rgba(255, 235, 19, 1)'
                    />
                </Box>
            </Container>
        </Container>
    )
}

export default CategoryPage