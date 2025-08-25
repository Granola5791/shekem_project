import React from 'react'
import CartItem from '../components/CartItemCard'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

const CartPage = () => {
  return (

    <Container maxWidth="md" sx={{ height: '100vh', border: '1px solid black', padding: '10px' }}>
      <Grid >
        <CartItem />
      </Grid>
    </Container>

  )
}

export default CartPage