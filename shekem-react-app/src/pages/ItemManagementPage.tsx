import React, { useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import { useSearchParams } from 'react-router-dom';
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants';
import { FetchSearchItems, type Item } from '../utils/manageItems';
import AdminItemCard from '../components/AdminItemCard';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PaginationControls from '../components/PaginationControls';

const ItemManagementPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const [items, setItems] = React.useState<Item[]>([]);
    const [itemCount, setItemCount] = React.useState(0);
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);

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

            if (query !== '') {
                const [searchItems, itemCount] = await FetchSearchItems(query, parseInt(page), backend, general);
                setItems(searchItems);
                setItemCount(itemCount);
            }
        };
        fetchData();
    }, [query, page]);


    if (!hebrewConstants || !backendConstants || !generalConstants) return <div>Loading...</div>;

    return (
        <Container
            disableGutters
            sx={{
                bgcolor: 'rgba(250, 250, 250, 1)',
                height: '100vh',
                padding: '10px',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <SearchBar
                    onSearch={(searchQuery: string) => {
                        setSearchParams({ q: searchQuery, page: '1' });
                    }}
                />
            </Box>


            <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center">
                {items.map((item: Item) => (
                    <AdminItemCard
                        key={item.id}
                        itemID={item.id}
                        itemIDLabel={hebrewConstants.items.item_id_label}
                        itemTitle={item.name}
                        price={item.price}
                        stock={item.stock}
                        buttonText={hebrewConstants.items.edit_item_button}
                        moneySymbol={hebrewConstants.items.money_symbol}
                        stockLabel={hebrewConstants.items.stock_label}
                        image={backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_item_photo_api, item.id)}
                        onEdit={() => { }}
                    />
                ))}
            </Grid>

            <PaginationControls
                pageCount={Math.ceil(itemCount / generalConstants.items_per_page)}
                currentPage={parseInt(page) - 1}
                goToPage={(page: number) => {
                    setSearchParams({ q: query, page: (page + 1).toString() });
                }}
            />
        </Container>
    )
}

export default ItemManagementPage