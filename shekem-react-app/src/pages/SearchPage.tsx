import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
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




const SearchPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [page, setPage] = React.useState<string>(searchParams.get('page') || '1');
    const {
        goToHome: GoToHome,
        goToCart: GoToCart,
        searchItems: SearchItems,
        goToLogin: GoToLogin
    } = useNavigation();
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [items, setItems] = React.useState<Item[]>([]);
    const [itemCount, setItemCount] = React.useState(0);

    useEffect(() => {
        const fetchData = async () => {
            let hebrew = hebrewConstants as HebrewConstants;
            let backend = backendConstants as BackendConstants;
            let general = generalConstants as GeneralConstants;
            if (!hebrew || !backend || !general) {
                hebrew = await FetchHebrewConstants();
                setHebrewConstants(hebrew);
                backend = await FetchBackendConstants();
                setBackendConstants(backend);
                general = await FetchGeneralConstants();
                setGeneralConstants(general);
            }

            const [searchItems, itemCount] = await FetchSearchItems(query, parseInt(page), backend, general);
            setItems(searchItems);
            setItemCount(itemCount);
        };
        fetchData();
    }, [query, page]);



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

    const GoToPage = (page: number) => {
        setSearchParams({ p: (page + 1).toString() });
        setPage((page + 1).toString());
    }


    if (!backendConstants || !generalConstants || !hebrewConstants) return <div>Loading...</div>;

    return (
        <>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoClick={GoToHome}
                logoSrc='\public\photos\caveret-logo.svg'
            />
            <Container
                disableGutters
                sx={{
                    bgcolor: 'rgba(250, 250, 250, 1)',
                    height: '100vh',
                    padding: '10px',
                    marginTop: '15vh'
                }}
            >

                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} >
                    {hebrewConstants.items.search_results_title}: "{query}"
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
            </Container>
        </>
    )
}

export default SearchPage