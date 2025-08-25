import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

const CartItem = () => {

  const [selectCount, setSelectCount] = React.useState(0);

  return (
    <>
      <Card sx={{ display: 'flex', position: 'relative', gap: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 151, height: 151 }}
          image="src/assets/item_example.jpg"
          alt="Item"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px' }}>
          <Typography>
            JBL רמקול אלחוטי FLIP 6 שחור
          </Typography>
          <Typography fontWeight={'bold'}>
            100₪
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography>
              כמות:
            </Typography>

            <IconButton onClick={() => { setSelectCount(selectCount + 1) }}>
              <AddIcon />
            </IconButton>

            {selectCount}

            <IconButton onClick={() => { selectCount && setSelectCount(selectCount - 1) /*can't go below 0*/ }}>
              <RemoveIcon />
            </IconButton>
          </Box>
        </Box>

        <IconButton sx={{ position: 'absolute', top: 0, left: 0 }}>
          <DeleteIcon />
        </IconButton>

      </Card>
    </>
  )
}

export default CartItem