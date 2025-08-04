export function isGenericOKResponse(response: Response) {
    return response.status >= 200 && response.status < 300;
}

export function isUnauthorizedResponse(response: Response) {
    return response.status === 401;
}