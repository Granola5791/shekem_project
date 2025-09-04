import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CheckLoginLoader, CheckAdminLoader } from './utils/checkLogin.ts';
import NotFound from './pages/NotFoundPage.tsx';
import CartPage from './pages/CartPage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ItemManagementPage from './pages/ItemManagementPage.tsx';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/home",
        element: <HomePage />,
        errorElement: <ErrorPage />,
        loader: CheckLoginLoader,
    },
    {
        path: "/cart",
        element: <CartPage />,
        errorElement: <ErrorPage />,
        loader: CheckLoginLoader,
    },
    {
        path: "/category/:id",
        element: <CategoryPage />,
        errorElement: <ErrorPage />,
        loader: CheckLoginLoader,
    },
    {
        path: "/search",
        element: <SearchPage />,
        errorElement: <ErrorPage />,
        loader: CheckLoginLoader,
    },
    {
        path: "/manage/items",
        element: <ItemManagementPage />,
        errorElement: <ErrorPage />,
        loader: CheckAdminLoader,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
