declare global {
    interface Window {
        gtag: Function
    }
}

export type Permission = "granted" | "denied"

export type Permissions = {
    ad_storage: Permission, 
    ad_user_data: Permission,
    ad_personalization: Permission,
    analytics_storage: Permission
}

export const create_permissions = (permission: Permission = "denied") : Permissions => {
    return {
        ad_storage: permission, 
        ad_user_data: permission,
        ad_personalization: permission,
        analytics_storage: permission
    }
}

export const useSetGoogleConsent = async (p: Permissions) => {
    window.gtag('consent', 'update', {
        'ad_storage': p.ad_storage,
        'ad_user_data': p.ad_user_data,
        'ad_personalization': p.ad_personalization,
        'analytics_storage': p.analytics_storage
    });
}

export function setCookie(cookie_name: string, value: string, expire_days: number) {
    const d = new Date();
    d.setTime(d.getTime() + (expire_days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cookie_name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(cookie_name: string) {
    let name = cookie_name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export function deserialize_ga_cookie_permissions(): {permissions: Permissions, cookies_where_set: boolean} {
    let cookie: any =  {}
    let permissions = create_permissions("granted");
    let was_set = true;

    try {
        cookie = JSON.parse(getCookie("cookies_permission"))

        Object.keys(cookie).forEach((key: any) => {
            //@ts-ignore
            permissions[key] = cookie[key]
        });
    } catch {
        was_set = false;
    }

    useSetGoogleConsent(permissions);

    return {
        permissions,
        cookies_where_set: was_set
    }
}