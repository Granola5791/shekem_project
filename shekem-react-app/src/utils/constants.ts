import { parse } from 'yaml';

export type HebrewConstants = {
    add_to_cart_button: string;
    shekel_symbol: string;
    search_bar_text: string;
    category_list_title: string;
    wait_text: string;
    user_errors: {
        generic_error: string;
        page_not_found: string;
        password_mismatch: string;
        invalid_username_or_password: string;
        username_taken: string;
        server_error: string;
    };
    signup_texts: {
        signup_title: string;
        username_placeholder: string;
        password_placeholder: string;
        re_password_placeholder: string;
        signup_button_text: string;
        login_link: {
            text: string;
            link_text: string;
        };
        input_requirements_msg: {
            strong: string;
            text: string;
        }
    };

    items: {
        quantity_label: string;
        money_symbol: string;
    };

    checkout: {
        title: string;
        price_label: string;
        button_text: string;
    };
};

export type BackendConstants = {
    backend_address: string;
    add_to_cart_api: string;
    get_categories_api: string;
    get_category_photo_api: string;
    get_cart_api: string;
    get_item_photo_api: string;
    delete_from_cart_api: string;
    update_cart_item_quantity_api: string;
    signup_api: string;

    statuses: {
        ok: string;
        unauthorized: string;
        not_found: string;
        internal_server_error: string;
    };

    status_codes: {
        ok: number;
        created: number;
        bad_request: number;
        unauthorized: number;
        not_found: number;
        conflict: number;
        internal_server_error: number;
    };
};

export type GeneralConstants = {
    errors: {
        config_load_fail: string;
        config_not_found: string;
        category_load_fail: string;
        category_load_not_found: string;
        cart_load_fail: string;
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

export async function FetchHebrewConstants() {
    const res = await fetch('src/constants/hebrew.yaml');
    const text = await res.text();
    return parse(text);
};

export async function FetchBackendConstants() {
    const res = await fetch('src/constants/backend_api.yaml');
    const text = await res.text();
    return parse(text);
};

export async function FetchGeneralConstants() {
    const res = await fetch('src/constants/general_constants.yaml');
    const text = await res.text();
    return parse(text);
};