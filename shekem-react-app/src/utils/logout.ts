import type { BackendConstants } from "./constants";
import { FetchBackendConstants } from "./constants.ts";

export async function Logout() {
    const backendConstants = await FetchBackendConstants() as BackendConstants;
    const res = await fetch(backendConstants.backend_address + backendConstants.logout_api, {
        method: 'POST',
        credentials: 'include'

    });
    return res;
}