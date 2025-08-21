export type HebrewConstants = {
    add_to_cart_button: string;
    shekel_symbol: string;
    search_bar_text: string;
    category_list_title: string;
    user_errors: {
        page_not_found: string;
    };
    go_to_login: string;
    go_to_home: string;
};

export type BackendConstants = {
    backend_address: string;
    add_to_cart_api: string;
    get_categories_api: string;
    get_category_photo_api: string;

    statuses: {
        ok: string;
        unauthorized: string;
        not_found: string;
        internal_server_error: string;
    };

    status_codes: {
        ok: number;
        unauthorized: number;
        not_found: number;
        internal_server_error: number;
    };
};

export type GeneralConstants = {
    errors: {
        config_load_fail: string;
        config_not_found: string;
        category_load_fail: string;
        category_load_not_found: string;
    };
};

export function insertValuesToConstantStr(configString: string, ...values: number[]): string {
    let argsIndex = 0;
    let result = '';
    for (let i = 0; i < configString.length; i++) {
        if (configString[i] === '{') {
            result += values[argsIndex];
            argsIndex++;
            while (i < configString.length && configString[i] !== '}') {
                i++;
            }
        } else {
            result += configString[i];
        }
    }
    return result;
}