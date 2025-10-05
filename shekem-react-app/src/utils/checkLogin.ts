import { isGenericOKResponse, isUnauthorizedResponse } from "./http.ts";
import { FetchBackendConstants } from "./constants.ts";
import type { BackendConstants } from "../utils/constants.ts";


export async function CheckLogin(apiPath: string) {
    const res = await fetch(apiPath, {
        method: 'GET',
        credentials: 'include'
    });
    return res;
}

export async function CheckAdmin(apiPath: string) {
    const res = await fetch(apiPath, {
        method: 'GET',
        credentials: 'include'
    });
    return res;
}

export async function CheckLoginLoader() {
    const backendConstants = await FetchBackendConstants() as BackendConstants;
    const res = await CheckLogin(backendConstants.backend_address + backendConstants.check_login_api);
    if (!isGenericOKResponse(res)) {
        throw new Response(backendConstants.statuses.unauthorized, {
            status: backendConstants.status_codes.found,
            headers: { Location: '/login' },
        });
    }
    return null;
}

export async function CheckAdminLoader() {
    const backendConstants = await FetchBackendConstants() as BackendConstants;
    const res = await CheckAdmin(backendConstants.backend_address + backendConstants.check_admin_api);
    if (!isGenericOKResponse(res)) {
        throw new Response(backendConstants.statuses.unauthorized, {
            status: backendConstants.status_codes.found,
            headers: { Location: '/login' },
        });
    }
    return null;
}