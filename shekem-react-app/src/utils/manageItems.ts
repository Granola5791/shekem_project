import type { BackendConstants, GeneralConstants } from "./constants";
import { insertValuesToConstantStr } from "./constants";

export type Item = {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export async function FetchSearchItems(searchTerm: string, page: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_search_items_page_api, searchTerm, page), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.search_load_fail);
    const data = await res.json();
    return [data.items, data.count];
}