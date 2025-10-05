import React, { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { useNavigation } from '../utils/navigation';
import type { BackendConstants, GeneralConstants, HebrewConstants } from '../utils/constants';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants';
import type { Item } from '../utils/manageItems';
import { FetchSearchItems } from '../utils/manageItems';
import ItemCard from '../components/ItemCard';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import NavBar from '../components/NavBar';
import PaginationControls from '../components/PaginationControls';
import { isUnauthorizedResponse } from '../utils/http';
import OneButtonPopUp from '../components/OneButtonPopUp';
import Box from '@mui/material/Box';
import HamburgerMenu from '../components/HamburgerMenu';
import { Logout } from '../utils/logout';
import SearchFilter from '../components/SearchFilter';
import { FetchCategories } from '../utils/categories';
import type { Category } from '../utils/categories';



const SearchPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const [page, setPage] = React.useState<string>(searchParams.get('page') || '1');
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [items, setItems] = React.useState<Item[]>([]);
    const [itemCount, setItemCount] = React.useState(0);
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
            try {
                let hebrew = hebrewConstants as HebrewConstants;
                let backend = backendConstants as BackendConstants;
                let general = generalConstants as GeneralConstants;
                let cats = categories as Category[];
                if (!hebrew || !backend || !general) {
                    hebrew = await FetchHebrewConstants();
                    setHebrewConstants(hebrew);
                    backend = await FetchBackendConstants();
                    setBackendConstants(backend);
                    general = await FetchGeneralConstants();
                    setGeneralConstants(general);
                }

                if (!categories || categories.length === 0) {
                    cats = await FetchCategories(backend, general);
                    setCategories(cats);
                }

                const [searchItems, itemCount] = await FetchSearchItems(searchParams.toString(), backend, general);
                setItems(searchItems);
                setItemCount(itemCount);
            } catch (err) {
                setOpenError(true);
            }
        };
        fetchData();
    }, [searchParams]);



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

    const GoToPage = (page: number) => {
        setSearchParams({ p: (page + 1).toString(), q: query, category: category, sort: sort });
        setPage((page + 1).toString());
    }

    const LogoutUser = async () => {
        const res = await Logout();
        if (!res.ok) {
            setOpenError(true);
            return;
        }
        GoToLogin();
    }

    const FilterItems = (newCategory: string, newSort: string) => {
        setSearchParams({ q: query, category: newCategory, sort: newSort, page: '1' });
    }


    if (!backendConstants || !generalConstants || !hebrewConstants) return <div>Loading...</div>;

    return (
            <Container maxWidth={false} sx={{ bgcolor: '#ffeb13' }}>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoClick={GoToHome}
                logoSrc='\photos\caveret-logo.svg'
                onMenuClick={() => setMenuOpen(!menuOpen)}
                showEditButton={isAdmin}
                onEdit={GoToManagement}
            />
                <Container
                    maxWidth='md'
                    disableGutters
                    sx={{
                        minHeight: '100vh',
                        bgcolor: 'white',
                        padding: '10px',
                        marginTop: '15vh'
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} >
                        {hebrewConstants.items.search_results_title}: "{query}"
                    </Typography>

                    <SearchFilter
                        categories={categories}
                        categoriesLabel={hebrewConstants.items.filter_by_category_label}
                        sortOptions={generalConstants.items.sort_by_options}
                        sortOptionsLabels={hebrewConstants.items.sort_by_options_labels}
                        sortLabel={hebrewConstants.items.sort_by_label}
                        filterButtonText={hebrewConstants.items.filter_button}
                        noneSelectedText={hebrewConstants.items.none_selected_text}
                        onFilter={FilterItems}
                        sx={{ margin: '20px' }}
                    />

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

export default SearchPage