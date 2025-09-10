import React from 'react'
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageUploader from './ImageUploader';

interface ItemEditProps {
    open: boolean
    itemID?: number
    itemIDLabel: string
    itemTitle?: string
    itemTitleLabel: string
    price?: number
    priceLabel: string
    stock?: number
    stockLabel: string
    imageUrl?: string
    imageLabel: string
    onSubmit?: (itemID: number, itemTitle: string, price: number, stock: number, image: File | null) => void
    submitButtonText?: string
    onCancel?: () => void
    cancelButtonText?: string
    readonlyID?: boolean

}

const ItemEdit = ({ open, itemID, itemIDLabel, itemTitle, itemTitleLabel, price, priceLabel, stock, stockLabel, imageUrl, imageLabel, onSubmit, submitButtonText, onCancel, cancelButtonText, readonlyID }: ItemEditProps) => {

    const [image, setImage] = React.useState<File | null>(null);
    const [imageUrlHook, setImageUrlHook] = React.useState<string>(imageUrl || '');
    const [priceHook, setPriceHook] = React.useState<number>(price || 0);
    const [stockHook, setStockHook] = React.useState<number>(stock || 0);
    const [itemTitleHook, setItemTitleHook] = React.useState<string>(itemTitle || '');
    const [itemIDHook, setItemIDHook] = React.useState<number>(itemID || 0);

    const HandleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileUrl = URL.createObjectURL(file);
            setImage(file);
            setImageUrlHook(fileUrl);
        }
    }

    const OnCancel = () => {
        setImageUrlHook('');
        setImage(null);
        onCancel?.();
    }

    return (
        <Dialog open={open} onClose={() => { setImage(null); setImageUrlHook(imageUrl || ''); }}>
            <Stack spacing={2} padding={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="id">{itemIDLabel}:</label>
                    <TextField
                        id='id'
                        onChange={(e) => setItemIDHook(parseInt(e.target.value))}
                        type='number'
                        placeholder={itemIDLabel}
                        defaultValue={itemID}
                        disabled={readonlyID}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="name">{itemTitleLabel}:</label>
                    <TextField
                        id='name'
                        onChange={(e) => setItemTitleHook(e.target.value)}
                        placeholder={itemTitleLabel}
                        defaultValue={itemTitle}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="price">{priceLabel}:</label>
                    <TextField
                        id='price'
                        type='number'
                        onChange={(e) => setPriceHook(parseFloat(e.target.value))}
                        placeholder={priceLabel}
                        defaultValue={price}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="stock">{stockLabel}:</label>
                    <TextField
                        id='stock'
                        onChange={(e) => setStockHook(parseInt(e.target.value))}
                        type='number'
                        placeholder={stockLabel}
                        defaultValue={stock}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <label>{imageLabel}:</label>
                    <ImageUploader onChange={HandleImageUpload} fileUrl={imageUrlHook} />
                </Box>
            </Stack>

            <Box gap={2} sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                <Button variant='outlined' onClick={OnCancel}>
                    {cancelButtonText}
                </Button>
                <Button variant='contained' onClick={() => {onSubmit?.(itemIDHook, itemTitleHook, priceHook, stockHook, image); OnCancel(); }} sx={{ backgroundColor: 'rgb(239, 232, 26)' }}>
                    {submitButtonText}
                </Button>
            </Box>
        </Dialog>
    )
}

export default ItemEdit