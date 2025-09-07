import React, { useEffect } from 'react'
import AdminUserCard from '../components/AdminUserCard'
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants'
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants, insertValuesToConstantStr } from '../utils/constants'
import type { User } from '../utils/manageUsers'
import { FetchSearchUsers } from '../utils/manageUsers'
import { useSearchParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import PaginationControls from '../components/PaginationControls'
import SearchBar from '../components/SearchBar'

const UserManagementPage = () => {

    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants>();
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants>();
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants>();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const [users, setUsers] = React.useState<Map<number, User>>(new Map());
    const [userCount, setUserCount] = React.useState(0);

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
                const [searchUsers, userCount] = await FetchSearchUsers(query, parseInt(page), backend, general);
                const userMap = new Map<number, User>(searchUsers.map((user: User) => [user.id, user]));
                setUsers(userMap);
                setUserCount(userCount);
            }
        };
        fetchData();
    }, [query, page]);

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>Loading...</div>;
    }

    return (
        <Container
            disableGutters
            sx={{
                bgcolor: 'rgba(250, 250, 250, 1)',
                height: '100vh',
                padding: '10px',
            }}
        >
            <SearchBar
                onSearch={(searchQuery: string) => {
                    setSearchParams({ q: searchQuery, page: '1' });
                }}
            />
            <Grid container spacing={2} sx={{ marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
                {[...users.values()].map((user: User) => (
                    <AdminUserCard
                        key={user.id}
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
                        onDelete={(id: number) => { }}
                        onEdit={(id: number) => { }}
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
        </Container>
    )
}

export default UserManagementPage