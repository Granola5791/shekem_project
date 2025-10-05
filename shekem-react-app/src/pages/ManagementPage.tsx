import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import type { HebrewConstants } from '../utils/constants'
import { FetchHebrewConstants } from '../utils/constants'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'
import HamburgerMenu from '../components/HamburgerMenu'
import { Logout } from '../utils/logout'
import OneButtonPopUp from '../components/OneButtonPopUp'

const ManagementPage = () => {

    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants>()
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const {
        goToCart: GoToCart,
        goToHome: GoToHome,
        searchItems: SearchItems,
        goToManagement: GoToManagement,
        goToLogin: GoToLogin,
        goToOrders: GoToOrders,
    } = useNavigation(true);

    useEffect(() => {
        const fetchConstants = async () => {
            const hebrew = await FetchHebrewConstants();
            setHebrewConstants(hebrew);
        };
        fetchConstants();
    }, []);

    if (!hebrewConstants) {
        return <div>Loading...</div>;
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
        <Container maxWidth={false} sx={{ bgcolor: '#ffeb13' }}>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoSrc="/photos/caveret-logo.svg"
                logoClick={GoToHome}
                showEditButton={true}
                onEdit={GoToManagement}
                onMenuClick={() => setMenuOpen(true)}
            />
            <Container
                maxWidth='md'
                sx={{
                    height: '100vh',
                    bgcolor: 'white',
                    marginTop: '15vh',
                    padding: '20px',
                }}
            >
                <Box>
                    <Typography variant='h4' align='center'>
                        {hebrewConstants.management.management_page_title}
                    </Typography>
                </Box>

                <Box
                    height={'100%'}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    gap={2}
                >
                    <Box
                        width={'200px'}
                        bgcolor={'rgba(255, 249, 60, 1)'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        border={'2px solid black'}
                        borderRadius={'10px'}
                    >
                        <Link to="/manage/users" style={{ textDecoration: 'none', color: 'black' }}>
                            <Typography variant='h5'>
                                {hebrewConstants.management.manage_users}
                            </Typography>
                        </Link>
                    </Box>
                    <Box
                        width={'200px'}
                        bgcolor={'rgba(255, 249, 60, 1)'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        border={'2px solid black'}
                        borderRadius={'10px'}
                    >
                        <Link to="/manage/items" style={{ textDecoration: 'none', color: 'black' }}>
                            <Typography variant='h5'>
                                {hebrewConstants.management.manage_items}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
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
            </Container >
        </Container>
    )
}

export default ManagementPage