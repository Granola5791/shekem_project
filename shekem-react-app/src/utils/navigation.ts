import { useNavigate } from 'react-router-dom';

export function useNavigation(isAdmin = false) {
    const navigate = useNavigate();

    if (isAdmin) {
        return {
            searchItems: (searchInput: string) => navigate(`/search/?q=${searchInput}`, { state: { role: 'admin' } }),
            goToCategory: (id: number) => navigate(`/category/${id}`, { state: { role: 'admin' } }),
            goToHome: () => navigate('/home', { state: { role: 'admin' } }),
            goToOrders: () => navigate('/orders', { state: { role: 'admin' } }),
            goToManagement: () => navigate('/manage', { state: { role: 'admin' } }),
            goToCart: () => navigate('/cart', { state: { role: 'admin' } }),
            goToLogin: () => navigate('/login'),
        };
    }
    else {
        return {
            searchItems: (searchInput: string) => navigate(`/search/?q=${searchInput}`),
            goToCategory: (id: number) => navigate(`/category/${id}`),
            goToCart: () => navigate('/cart'),
            goToHome: () => navigate('/home'),
            goToLogin: () => navigate('/login'),
            goToOrders: () => navigate('/orders'),
            goToManagement: () => navigate('/manage'),
        };
    }
}