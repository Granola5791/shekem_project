import React, { useEffect } from 'react'
import AdminUserCard from '../components/AdminUserCard'
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants'
import type { User } from '../utils/manageUsers'
import { FetchSearchUsers, DeleteUserFromBackend, SetAdminInBackend } from '../utils/manageUsers'
import { useSearchParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import PaginationControls from '../components/PaginationControls'
import SearchBar from '../components/SearchBar'
import Box from '@mui/material/Box'
import OneButtonPopUp from '../components/OneButtonPopUp'
import { useConfirm } from '../components/useConfirm'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'
import HamburgerMenu from '../components/HamburgerMenu'
import { Logout } from '../utils/logout'
import CartDrawer from '../components/CartDrawer'

const UserManagementPage = () => {

    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants>();
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants>();
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants>();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const [users, setUsers] = React.useState<Map<number, User>>(new Map());
    const [userCount, setUserCount] = React.useState(0);
    const [openError, setOpenError] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const { askConfirm, ConfirmDialog } = useConfirm();
    const { goToHome: GoToHome,
        goToCart: GoToCart,
        searchItems: SearchItems,
        goToLogin: GoToLogin,
        goToOrders: GoToOrders,
        goToManagement: GoToManagement,
    } = useNavigation(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
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

                const [searchUsers, userCount] = await FetchSearchUsers(query, parseInt(page), backend, general);
                const userMap = new Map<number, User>(searchUsers.map((user: User) => [user.id, user]));
                setUsers(userMap);
                setUserCount(userCount);
            } catch (err) {
                setOpenError(true);
            }
        };
        fetchData();
    }, [query, page]);

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>Loading...</div>;
    }

    const DeleteUser = async (userID: number) => {
        const deleteUserFromFrontend = () => {
            const newUsers = new Map(users);
            newUsers.delete(userID);
            setUsers(newUsers);
        }

        const userConfirmed = await askConfirm(hebrewConstants.are_you_sure);
        if (!userConfirmed) {
            return;
        }

        try {
            await DeleteUserFromBackend(userID, backendConstants, generalConstants);
        } catch (err) {
            setOpenError(true);
            return;
        }
        deleteUserFromFrontend();
    }

    const SetAdmin = async (userID: number) => {
        const userConfirmed = await askConfirm(hebrewConstants.are_you_sure);
        if (!userConfirmed) {
            return;
        }
        await SetAdminInBackend(userID, backendConstants, generalConstants);
        window.location.reload();
    }

    const LogoutUser = async () => {
        const res = await Logout();
        if (!res.ok) {
            setOpenError(true);
            return;
        }
        GoToLogin();
    }

    const OpenCart = () => {
        setCartOpen(true);
    }


    return (
        <Container maxWidth={false} sx={{ bgcolor: '#ffeb13' }}>
            <NavBar
                onSearch={SearchItems}
                goToCart={OpenCart}
                logoSrc="/photos/caveret-logo.svg"
                logoClick={GoToHome}
                showEditButton={true}
                onEdit={GoToManagement}
                onMenuClick={() => setMenuOpen(true)}
            />
            <Container
                maxWidth='md'
                disableGutters
                sx={{
                    bgcolor: 'rgba(250, 250, 250, 1)',
                    minHeight: '100vh',
                    padding: '10px',
                    marginTop: '15vh',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: '30px' }}>
                    <SearchBar
                        onSearch={(searchQuery: string) => {
                            setSearchParams({ q: searchQuery, page: '1' });
                        }}
                    />
                </Box>
                <Grid container spacing={2} sx={{ marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
                    {[...users.values()].map((user: User) => (
                        <AdminUserCard
                            key={user.id}
                            isAdmin={user.role.includes(generalConstants.users.admin_role)}
                            userID={user.id}
                            userIDLabel={hebrewConstants.users.user_id}
                            username={user.username}
                            usernameLabel={hebrewConstants.users.username}
                            privileges={user.role ? user.role : hebrewConstants.users.no_privileges}
                            privilegesLabel={hebrewConstants.users.privileges}
                            createdAt={user.created_at}
                            createdAtLabel={hebrewConstants.users.created_at}
                            deleteButtonText={hebrewConstants.users.delete_user}
                            editButtonText={hebrewConstants.users.set_admin}
                            onDelete={DeleteUser}
                            onEdit={SetAdmin}
                        />
                    ))}
                </Grid>
                <PaginationControls
                    pageCount={Math.ceil(userCount / generalConstants.items_per_page)}
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
                <ConfirmDialog
                    yesButtonText={hebrewConstants.ok}
                    noButtonText={hebrewConstants.cancel}
                />
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
                <CartDrawer
                    open={cartOpen}
                    onClose={() => setCartOpen(false)}
                    backendConstants={backendConstants}
                    hebrewConstants={hebrewConstants}
                />
            </Container>
        </Container>
    )
}

export default UserManagementPage