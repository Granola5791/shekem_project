import type { BackendConstants, GeneralConstants } from "./constants";

export type Order = {
    order_id: number;
    date: string;
    total_price: number;
    items: OrderItem[];
}

export type OrderItem = {
    item_id: number;
    item_name: string;
    quantity: number;
    price: number;
}

export async function FetchOrders(searchParams: string, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + backendConstants.get_orders_api + searchParams, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.order_load_fail);
    const data = await res.json();
    return [data.orders, data.count];
}