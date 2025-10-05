import { insertValuesToConstantStr } from "./constants";
import type { BackendConstants, GeneralConstants } from "./constants";

export type User = {
    id: number,
    username: string,
    role: string,
    created_at: string
}

export async function FetchSearchUsers(searchTerm: string, page: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.get_search_users_page_api, searchTerm, page), {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.search_load_fail);
    const data = await res.json();
    return [data.users, data.count];
}

export async function DeleteUserFromBackend(userID: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.delete_user_api, userID), {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.delete_user_fail);
}

export async function SetAdminInBackend(userID: number, backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.set_admin_api, userID), {
        method: 'PATCH',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(generalConstants.errors.set_admin_fail);
}

export async function IsAdmin(backendConstants: BackendConstants, generalConstants: GeneralConstants) {
    const res = await fetch(backendConstants.backend_address + insertValuesToConstantStr(backendConstants.check_admin_api), {
        method: 'GET',
        credentials: 'include'
    });
    return res.ok;
}