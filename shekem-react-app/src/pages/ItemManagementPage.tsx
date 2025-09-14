import React, { useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import { Link, useSearchParams } from 'react-router-dom';
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants';
import { FetchSearchItems, type Item } from '../utils/manageItems';
import AdminItemCard from '../components/AdminItemCard';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PaginationControls from '../components/PaginationControls';
import ItemEdit from '../components/ItemEdit';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import { useNavigation } from '../utils/navigation';
import OneButtonPopUp from '../components/OneButtonPopUp';

const ItemManagementPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const [items, setItems] = React.useState<Map<number, Item>>(new Map());
    const [itemCount, setItemCount] = React.useState(0);
    const [openItemEdit, setOpenItemEdit] = React.useState(false);
    const [openNewItemEdit, setOpenNewItemEdit] = React.useState(false);
    const [currItemID, setCurrItemID] = React.useState(-1);
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);
    const [openError, setOpenError] = React.useState(false);
    const { goToHome: GoToHome } = useNavigation();

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
                const itemMap = new Map<number, Item>(searchItems.map((item: Item) => [item.id, item]));
                setItems(itemMap);
                setItemCount(itemCount);
            }
        };
        fetchData();
    }, [query, page]);

    const UpdateItem = async (itemID: number, itemTitle: string, price: number, stock: number, image: File | null) => {
        if (!backendConstants) {
            return;
        }
        const updateBackend = async () => {
            const formData = new FormData();
            formData.append('item_title', itemTitle);
            formData.append('price', price.toString());
            formData.append('stock', stock.toString());
            if (image) {
                formData.append('image', image);
            }
            const path = (image ?
                backendConstants.backend_address + insertValuesToConstantStr(backendConstants.update_item_with_photo_api, itemID) :
                backendConstants.backend_address + insertValuesToConstantStr(backendConstants.update_item_api, itemID)
            );

            const res = await fetch(path, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            })
            return res.ok;
        }

        const updateFrontend = () => {
            const item = items.get(itemID);
            if (item) {
                const updatedItem = { ...item, name: itemTitle, price, stock };
                setItems(new Map(items).set(itemID, updatedItem));
            }
        }

        const isOK = await updateBackend();
        if (!isOK) {
            setOpenError(true);
            return;
        }
        updateFrontend();
    };

    const AddItem = async (itemID: number, itemTitle: string, price: number, stock: number, image: File | null) => {
        if (!backendConstants) {
            return;
        }
        const formData = new FormData();
        formData.append('item_id', itemID.toString());
        formData.append('item_title', itemTitle);
        formData.append('price', price.toString());
        formData.append('stock', stock.toString());
        formData.append('image', image as Blob);
        const res = await fetch(backendConstants.backend_address + backendConstants.add_item_api, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
        if (!res.ok) {
            setOpenError(true);
            return;
        }
    }

    const DeleteItem = async (itemID: number) => {
        if (!backendConstants) {
            return;
        }
        const deleteFromBackend = async () => {
            const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.delete_item_api, itemID), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            return res.ok;
        }
        const deleteFromFrontend = () => {
            const newItems = new Map(items);
            newItems.delete(itemID);
            setItems(newItems);
        }

        const isOK = await deleteFromBackend();
        if (!isOK) {
            setOpenError(true);
            return;
        }
        deleteFromFrontend();
    }

    const handleOpenItemEdit = (itemID: number) => {
        setCurrItemID(itemID);
        setOpenItemEdit(true);
    };

    const handleCloseItemEdit = () => {
        setOpenItemEdit(false);
        setCurrItemID(-1);
    };

    const handleOpenNewItemEdit = () => {
        setOpenNewItemEdit(true);
    };

    const handleCloseNewItemEdit = () => {
        setOpenNewItemEdit(false);
    };


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

            <Link to="/home" style={{ position: 'absolute' }}>
                <img style={{ maxHeight: '200px', width: '200px' }} src="/photos/caveret-logo.svg" alt="logo" />
            </Link>

            <Box gap={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '30px' }}>

                <SearchBar
                    onSearch={(searchQuery: string) => {
                        setSearchParams({ q: searchQuery, page: '1' });
                    }}
                />

                <IconButton onClick={handleOpenNewItemEdit} sx={{ bgcolor: 'rgba(255, 235, 19, 1)', borderRadius: '10%', height: 'fit-content' }}>
                    <AddIcon />
                    <Typography>{hebrewConstants.items.add_item}</Typography>
                </IconButton>
            </Box>


            <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center" sx={{ marginTop: '20px' }}>
                {[...items.values()].map((item: Item) => (
                    <AdminItemCard
                        key={item.id}
                        itemID={item.id}
                        itemIDLabel={hebrewConstants.items.item_id_label}
                        itemTitle={item.name}
                        price={item.price}
                        stock={item.stock}
                        editButtonText={hebrewConstants.items.edit_item_button}
                        deleteButtonText={hebrewConstants.items.delete_item}
                        moneySymbol={hebrewConstants.items.money_symbol}
                        stockLabel={hebrewConstants.items.stock_label}
                        image={backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_item_photo_api, item.id)}
                        onEdit={() => handleOpenItemEdit(item.id)}
                        onDelete={DeleteItem}
                    />
                ))}
            </Grid>

            {currItemID !== -1 && (
                <ItemEdit
                    open={openItemEdit}
                    itemID={currItemID}
                    itemIDLabel={hebrewConstants.items.item_id_label}
                    itemTitle={items.get(currItemID)?.name}
                    itemTitleLabel={hebrewConstants.items.item_name_label}
                    price={items.get(currItemID)?.price}
                    priceLabel={hebrewConstants.items.price_label}
                    stock={items.get(currItemID)?.stock}
                    stockLabel={hebrewConstants.items.stock_label}
                    imageLabel={hebrewConstants.items.item_photo_label}
                    imageUrl={backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_item_photo_api, currItemID)}
                    onCancel={handleCloseItemEdit}
                    onSubmit={UpdateItem}
                    cancelButtonText={hebrewConstants.items.cancel_button}
                    submitButtonText={hebrewConstants.items.submit_button}
                    readonlyID
                />
            )}

            <ItemEdit
                open={openNewItemEdit}
                itemIDLabel={hebrewConstants.items.item_id_label}
                itemTitleLabel={hebrewConstants.items.item_name_label}
                priceLabel={hebrewConstants.items.price_label}
                stockLabel={hebrewConstants.items.stock_label}
                imageLabel={hebrewConstants.items.item_photo_label}
                onCancel={handleCloseNewItemEdit}
                onSubmit={AddItem}
                cancelButtonText={hebrewConstants.items.cancel_button}
                submitButtonText={hebrewConstants.items.submit_button}
            />

            <PaginationControls
                pageCount={Math.ceil(itemCount / generalConstants.items_per_page)}
                currentPage={parseInt(page) - 1}
                goToPage={(page: number) => {
                    setSearchParams({ q: query, page: (page + 1).toString() });
                }}
            />
            <OneButtonPopUp
                open={openError}
                theme='error'
                buttonText={hebrewConstants.ok}
                onButtonClick={() => setOpenError(false)}
            >
                {hebrewConstants.user_errors.generic_error}
            </OneButtonPopUp>
        </Container>
    )
}

export default ItemManagementPage