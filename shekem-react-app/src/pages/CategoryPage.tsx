import React from 'react'
import Typography from '@mui/material/Typography'
import NavBar from '../components/NavBar'
import { useNavigation } from '../utils/navigation'

const CategoryPage = () => {

    const {
        goToHome: GoToHome,
        goToCart: GoToCart,
        searchItems: SearchItems
    } = useNavigation()

    return (
        <>
            <NavBar
                onSearch={SearchItems}
                goToCart={GoToCart}
                logoClick={GoToHome}
            />            
        </>
    )
}

export default CategoryPage