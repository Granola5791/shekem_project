import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { FetchOrders } from '../utils/manageOrders'
import type { BackendConstants, GeneralConstants, HebrewConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants'
import type { Order } from '../utils/manageOrders'
import OrderCard from '../components/OrderCard'
import Container from '@mui/material/Container'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'
import HamburgerMenu from '../components/HamburgerMenu'
import { Logout } from '../utils/logout'
import Box from '@mui/material/Box'
import OneButtonPopUp from '../components/OneButtonPopUp'
import PaginationControls from '../components/PaginationControls'
import { useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'


const OrdersPage = () => {

    const [hebrewConstants, setHebrewConstants] = useState<HebrewConstants | null>(null)
    const [backendConstants, setBackendConstants] = useState<BackendConstants | null>(null)
    const [generalConstants, setGeneralConstants] = useState<GeneralConstants | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [orderCount, setItemCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const {
        searchItems: SearchItems,
        goToCart: GoToCart,
        goToHome: GoToHome,
        goToLogin: GoToLogin,
        goToOrders: GoToOrders,
    } = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('p') || '1';



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

            const [orders, orderCount] = await FetchOrders(searchParams.toString(), backend, general);
            setOrders(orders);
            setItemCount(orderCount);
        }

        fetchData();
    }, [searchParams]);

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>Loading...</div>;
    }


    const GoToPage = (page: number) => {
        setSearchParams({ p: (page + 1).toString() });
    }

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
                logoSrc='/src/assets/caveret-logo.svg'
                onSearch={SearchItems}
                logoClick={GoToHome}
                goToCart={GoToCart}
                onMenuClick={() => setMenuOpen(true)}
            />
            <Container maxWidth="md" sx={{ padding: '20px', bgcolor: 'rgba(218, 218, 218, 0.41)', marginTop: '15vh' }}>

                <Typography variant="h4" align="center">
                    <s>{hebrewConstants.orders.order_page_title.part1}</s> {hebrewConstants.orders.order_page_title.part2}
                </Typography>

                <Grid container spacing={2} justifyContent={'center'} marginTop={'20px'}>
                    {orders.map((order) => (
                        <Grid key={order.order_id} width={'80%'}>
                            <OrderCard
                                id={order.order_id}
                                orderItems={order.items}
                                total={order.total_price}
                                date={order.date}
                                hebrewConstants={hebrewConstants}
                                backendConstants={backendConstants}
                            />
                        </Grid>
                    ))}
                </Grid>

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

                <OneButtonPopUp
                    open={openError}
                    theme='error'
                    buttonText={hebrewConstants.ok}
                    onButtonClick={() => setOpenError(false)}
                >
                    {hebrewConstants.user_errors.generic_error}
                </OneButtonPopUp>
                {
                    orderCount > generalConstants.items_per_page &&
                    <PaginationControls
                        pageCount={Math.ceil(orderCount / generalConstants.items_per_page)}
                        currentPage={parseInt(page) - 1}
                        goToPage={GoToPage}
                    />
                }
            </Container >
        </>
    )
}

export default OrdersPage