import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface SearchFilterProps {
    categories?: string[];
    categoriesLabel?: string;
    sortOptions?: string[];
    sortLabel?: string;
    filterButtonText?: string;
    onFilter?: (category: string, sort: string) => void;
}

const SearchFilter = ({ categories, categoriesLabel, sortOptions, sortLabel, filterButtonText, onFilter }: SearchFilterProps) => {
    const [categorySelected, setCategorySelected] = React.useState<string>('');
    const [sortSelected, setSortSelected] = React.useState<string>('');

    return (
        <Box >
            <form action="" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <Box>
                    {categoriesLabel && <label htmlFor="category-filter">{categoriesLabel}: </label>}
                    {categories &&
                        <select
                            id="category-filter"
                            value={categorySelected}
                            onChange={(e) => setCategorySelected(e.target.value)}
                            style={{ backgroundColor: 'white', borderRadius: '5px', border: '1px solid gray', padding: '5px' }}
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    }
                </Box>

                <Box>
                    {sortLabel && <label htmlFor="sort-filter" style={{ marginLeft: '10px' }}>{sortLabel}</label>}
                    {sortOptions &&
                        <select
                            id="sort-filter"
                            value={sortSelected}
                            onChange={(e) => setSortSelected(e.target.value)}
                            style={{ backgroundColor: 'white', borderRadius: '5px', border: '1px solid gray', padding: '5px', marginLeft: '10px' }}
                        >
                            {sortOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    }
                </Box>

                <Button
                    variant="contained"
                    onClick={() => onFilter?.(categorySelected, sortSelected)}
                    sx={{ width: 'fit-content' }}
                >
                    {filterButtonText}
                </Button>
            </form>
        </Box>
    )
}

export default SearchFilter