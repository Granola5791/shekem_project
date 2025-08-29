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
import { useParams } from 'react-router-dom'

const FetchCategoryItems = async (categoryID: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_category_items_api, categoryID), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.items;
}

const CategoryPage = () => {


    const { id } = useParams();
    const [items, setItems] = React.useState<Item[]>([])
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);

    const {
        goToHome: GoToHome,
        goToCart: GoToCart,
        searchItems: SearchItems
    } = useNavigation()


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
                const thisItems = await FetchCategoryItems(parseInt(id), thisBackendConstants, thisGeneralConstants);
                setItems(thisItems);
            } catch (err: any) {
                console.error(err.message);
            }
        }
        fetchData();
    }, [id])

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <>loading</>
    }

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
                <Typography variant="h4" gutterBottom textAlign={'center'}>
                    Category name
                </Typography>

                <Grid container rowSpacing={1} columnSpacing={3} justifyContent="center">
                    {items.map((item: Item) => (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            itemTitle={item.title}
                            price={item.price}
                            stock={item.stock}
                            buttonText={hebrewConstants.items.add_to_cart_button}
                            moneySymbol={hebrewConstants.items.money_symbol}
                            stockLabel={hebrewConstants.items.stock_label}
                            image={backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_item_photo_api, item.id)}
                        />
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default CategoryPage