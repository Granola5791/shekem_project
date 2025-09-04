import { isUnauthorizedResponse } from "./http.ts";
import { FetchBackendConstants } from "./constants.ts";

export async function CheckLogin() {
    const backendConstants = await FetchBackendConstants();
    const res = await fetch(backendConstants.backend_address + backendConstants.check_login_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (isUnauthorizedResponse(res)) {
        throw new Response(backendConstants.statuses.unauthorized, {
            status: backendConstants.status_codes.found,
            headers: { Location: '/login' },
        });
    }
    return null;
}

export async function CheckAdmin() {
    const backendConstants = await FetchBackendConstants();
    const res = await fetch(backendConstants.backend_address + backendConstants.check_admin_api, {
        method: 'GET',
        credentials: 'include'
    });
    if (isUnauthorizedResponse(res)) {
        throw new Response(backendConstants.statuses.unauthorized, {
            status: backendConstants.status_codes.found,
            headers: { Location: '/login' },
        });
    }
    return null;
}