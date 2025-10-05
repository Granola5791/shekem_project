import type { BackendConstants, GeneralConstants } from "./constants";

export type Item = {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export type CartItemType = {
    itemID: number,
    quantity: number
    title: string,
    price: number,
    stock: number,
}
export async function FetchSearchItems(searchParams: string, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + backendConstants.get_search_items_page_api + searchParams, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.search_load_fail);
    const data = await res.json();
    return [data.items, data.count];
}