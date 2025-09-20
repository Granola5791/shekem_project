import type { BackendConstants, GeneralConstants } from './constants';


export type Category = {
    id: number;
    name: string;
}

export const FetchCategories = async (backendConstants: BackendConstants, generalConstants: GeneralConstants) => {
    if (!backendConstants) {
        console.error(generalConstants.errors.config_not_found);
        return [];
    }
    const res = await fetch(backendConstants.backend_address + backendConstants.get_categories_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.category_load_fail);
    const data = await res.json();
    return data.categories;
}