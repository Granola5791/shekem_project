import type { BackendConstants, GeneralConstants } from "./constants";

export async function FetchOrders(backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + backendConstants.get_orders_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.order_load_fail);
    const data = await res.json();
    return [data.orders, data.count];
}