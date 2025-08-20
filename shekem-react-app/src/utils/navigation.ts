import { useNavigate } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();

  return {
    searchItems: (searchInput: string) => navigate(`/search/?q=${searchInput}`),
    goToCategory: (id: number) => navigate(`/category/${id}`),
    goToCart: () => navigate('/cart'),
    goToHome: () => navigate('/home'),
    goToLogin: () => navigate('/login'),
  };
}