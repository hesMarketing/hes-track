let page_url = "";
let lead_origin = "unknown";
let browser_language = "unknown"

export const updateLeadOrigin = (browser_lang: string, browser_location: string, origem: string) => {
    page_url = browser_location;
    lead_origin = origem;
    browser_language = browser_lang
}


export const handle_form = async (form: FormData) => {

    form.append("URL_da_página", page_url);
    form.append("origem_da_lead", lead_origin);
    form.append("Linguagem do browser", browser_language);

    if(form.get("nome")) {
        let nome_completo = form.get("nome") as string;

        let p = nome_completo.split(" ");

        form.append("firstname", p[0]);

        if (p.length > 1) {
            form.append("lastname", p[p.length - 1]);
        }
    }

    let filledItems = 0;

    Array.from(form.entries()).forEach(element => {
        if ((element[1] as string).length > 0 ) {
            filledItems ++
        }
    });

    if (filledItems === 0) {
        return;
    }


    if (!form.get("email") || !new RegExp(/^\w+([\.-]?\w+)*(\+\w+)?@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(form.get("email") as string)) {
        form.set("email_fornecido", form.get("email") as string);
        form.set("email", "invalid_email_address@lead.com");
    }

    let params = [];

    for (let v of form.entries()) {
        params.push(`${v[0]}${(v[1] as string).length > 0 ? '=' : ''}${v[1]}`);
    }

    const data = await fetch('https://hesapis.netlify.app/.netlify/functions/lead?' + params.join("&"), {
        method: "get",
    })

    window.dispatchEvent(new Event("formProcessed"));

    if (data.status === 200) {
        //@ts-ignore
        gtag('event', 'conversion', {
            'page': window.location.pathname.split("/")[2],
            'value': 1
        });

        //@ts-ignore
        gtag('event', 'conversion', {'send_to': 'AW-814943838/WCMXCOqisKIZEN6czIQD'});
    }

    return data.status;
}

export const add_email_to_newsletter_list = async (email: string) : Promise<boolean> => {
    if(!new RegExp(/^\w+([\.-]?\w+)*(\+\w+)?@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
        return false;
    }

    const formData = new FormData();
    formData.append("assunto", "NEWSLETTER");
    formData.append("email", email);

    await handle_form(formData);

    return true
}