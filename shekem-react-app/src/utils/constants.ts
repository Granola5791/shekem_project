import { parse } from 'yaml';

export type HebrewConstants = {
    shekel_symbol: string;
    search_bar_text: string;
    category_list_title: string;
    wait_text: string;
    ok: string;
    cancel: string;
    are_you_sure: string;
    
    user_errors: {
        generic_error: string;
        page_not_found: string;
        password_mismatch: string;
        invalid_username_or_password: string;
        username_taken: string;
        server_error: string;
    };
    user_success: {
        generic_success: string;
        successful_signup: string;
        successful_purchase: string;
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

    login_texts: {
        login_title: string;
        username_placeholder: string;
        password_placeholder: string;
        login_button_text: string;
        signup_link: {
            text: string;
            link_text: string;
        };
    };

    items: {
        quantity_label: string;
        money_symbol: string;
        stock_label: string;
        add_to_cart_button: string;
        search_results_title: string;
        item_id_label: string;
        item_name_label: string;
        price_label: string;
        edit_item_button: string;
        item_photo_label: string;
        cancel_button: string;
        submit_button: string;
        add_item: string;
        delete_item: string;
    };

    checkout: {
        empty_cart_text: string;
        title: string;
        price_label: string;
        button_text: string;
        delete_entire_cart: string;
    };

    users: {
        username: string;
        privileges: string;
        created_at: string;
        user_id: string;
        delete_user: string;
        set_admin: string;
        no_privileges: string;
    }

    management: {
        management_page_title: string;
        manage_users: string;
        manage_items: string;
    }
    go_to_login: string;
    go_to_home: string;
};

export type BackendConstants = {
    backend_address: string;
    add_to_cart_api: string;
    get_categories_api: string;
    get_category_photo_api: string;
    get_cart_api: string;
    get_item_photo_api: string;
    get_category_items_page_api: string;
    get_category_items_count_api: string;
    get_category_name_api: string;
    get_search_items_page_api: string;
    get_search_users_page_api: string;
    delete_from_cart_api: string;
    delete_item_api: string;
    delete_user_api: string;
    delete_entire_cart_api: string;
    update_cart_item_quantity_api: string;
    update_item_api: string;
    update_item_with_photo_api: string;
    submit_order_api: string;
    signup_api: string;
    login_api: string;
    check_login_api: string;
    check_admin_api: string;
    add_item_api: string;
    set_admin_api: string;

    statuses: {
        ok: string;
        unauthorized: string;
        not_found: string;
        internal_server_error: string;
    };

    status_codes: {
        ok: number;
        created: number;
        found: number;
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
        order_submit_fail: string;
        search_load_fail: string;
        delete_user_fail: string;
        set_admin_fail: string;
    };

    users: {
        admin_role: string;
    };

    items_per_page: number;
};

export function insertValuesToConstantStr(configString: string, ...values: any[]): string {
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
    const res = await fetch('/constants/hebrew.yaml');
    const text = await res.text();
    return parse(text);
};

export async function FetchBackendConstants() {
    const res = await fetch('/constants/backend_api.yaml');
    const text = await res.text();
    return parse(text);
};

export async function FetchGeneralConstants() {
    const res = await fetch('/constants/general_constants.yaml');
    const text = await res.text();
    return parse(text);
};