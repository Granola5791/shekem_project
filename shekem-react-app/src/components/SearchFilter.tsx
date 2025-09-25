import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { Category } from '../utils/categories';




interface SearchFilterProps {
    categories?: Category[];
    categoriesLabel?: string;
    sortOptions?: string[];
    sortOptionsLabels?: string[];
    sortLabel?: string;
    filterButtonText?: string;
    noneSelectedText?: string;
    onFilter?: (category: string, sort: string) => void;
    sx?: object;
}

const SearchFilter = ({ categories, categoriesLabel, sortOptions, sortOptionsLabels, sortLabel, filterButtonText, noneSelectedText, onFilter, sx }: SearchFilterProps) => {
    const [categorySelected, setCategorySelected] = React.useState<string>('');
    const [sortSelected, setSortSelected] = React.useState<string>('');

    return (
        <Box sx={sx}>
            <form action="" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <Box>
                    {categoriesLabel && <label htmlFor="category-filter">{categoriesLabel}: </label>}
                    {categories &&
                        <select
                            id="category-filter"
                            onChange={(e) => setCategorySelected(e.target.value)}
                            defaultValue={''}
                            style={{ backgroundColor: 'white', borderRadius: '5px', border: '1px solid gray', padding: '5px' }}
                        >
                            <option value="">
                                {noneSelectedText}
                            </option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
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
                            defaultValue={''}
                            onChange={(e) => setSortSelected(e.target.value)}
                            style={{ backgroundColor: 'white', borderRadius: '5px', border: '1px solid gray', padding: '5px', marginLeft: '10px' }}
                        >
                            <option value="">
                                {noneSelectedText}
                            </option>
                            {sortOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {sortOptionsLabels ? sortOptionsLabels[index] : option}
                                </option>
                            ))}
                        </select>
                    }
                </Box>

                <Button
                    disabled={!categorySelected && !sortSelected}
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