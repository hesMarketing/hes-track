<template>
    <ClientOnly>
        <Teleport to="body">
            <div class="Cookie-wrapper" :class="{visible: showBanner}">
                <div class="backdrop"></div>
                <div class="cookie-banner">
                    <div class="page">
                        <div class="image" v-html="cookie"></div>
                        <div class="data-container">
                            <h2>Cookies</h2>
                            <p>Os cookies são utilizados para acessar e armazenar informações no seu dispositivo e para oferecer conteúdo e anúncios personalizados com base nos seus dados. Ao escolher "Concordo", concorda com o uso de cookies pela hes e parceiros. Pode recusar ou retirar o consentimento escolhendo "Gerir Configurações". <a :href="props.politicaCookies" target="_blank">Política de Privacidade</a></p>
                            <button class="concordo" @click="handle_accept">Concordo</button>
                            <button class="settings" @click="bannerPage = 1">Gerir Configurações</button>
                        </div>
                    </div>
                    <div class="page" :class="{disabled: bannerPage !== 1}">
                        <div class="data-container">
                            <h2>Valorizamos a sua privacidade</h2>
                            <p>Processamos os seus dados para entregar conteúdo ou anúncios e medimos a entrega de tal conteúdo ou anúncios para extrair insights sobre o nosso site. Compartilhamos estas informações com os nossos parceiros com base no consentimento e interesse legítimo, com base nas configurações em baixo. Estas escolhas serão transmitidas aos nossos fornecedores.</p>
                            <h3>Gerir definições de consentimento</h3>
                            <ul>
                                <li><span>Armazenamento de dados relacionados a publicidade</span> <toggle permission="ad_storage" @updated="update_permission" /></li>
                                <li><span>Permitir envio de dados de utilizador relacionados com publicidade para terceiros</span> <toggle permission="ad_user_data" @updated="update_permission" /></li>
                                <li><span>Permitir anúncios personalizados</span> <toggle permission="ad_personalization" @updated="update_permission"/></li>
                                <li><span>Armazenamento de dados relacionados com analytics</span> <toggle permission="analytics_storage" @updated="update_permission"/></li>
                            </ul>

                            <button class="concordo" @click="handle_accept">Concluir</button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </ClientOnly>
</template>

<script lang="ts" setup>
    import toggle from "../comp/switch.vue"

    import { useSetGoogleConsent, create_permissions, setCookie, deserialize_ga_cookie_permissions, type Permission} from "../composables/ga";
    //@ts-ignore
    import cookie from "./cookie.svg?raw"
    import {ref, onMounted} from "vue"

    const props = defineProps({
        politicaCookies: {
            default: "https://hes.pt/politica-de-privacidade"
        }
    });

    let permissions = ref(create_permissions("granted"));
    

    const showBanner = ref(false);

    const bannerPage = ref(0)

    onMounted(() => {
        let cookie = deserialize_ga_cookie_permissions();

        permissions.value = cookie.permissions;
        
        showBanner.value = !cookie.cookies_where_set
    })

    const handle_accept = () => {
        useSetGoogleConsent(permissions.value);

        setCookie("cookies_permission", JSON.stringify(permissions.value), 400);

        showBanner.value = false
    }

    const update_permission = (p: {permission: string, granted: Permission}) => {
        //@ts-ignore
        permissions.value[p.permission] = p.granted
        useSetGoogleConsent(permissions.value);
    }

</script>

<style lang="css" scoped>
    .Cookie-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        top: 0;
        left: 0;
        z-index: 999999;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        pointer-events: none;

        & .backdrop {
            position: absolute;
            display: block;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.4);
            z-index: 0;

            opacity: 0;
            pointer-events: none;
        }


        &.visible {
            & .backdrop {
                animation: becomeVisible .2s;
                animation-fill-mode: forwards;
                pointer-events: all;
            }
            
            & .cookie-banner {
                animation: scaleUp .3s;
                animation-delay: .12s;
                animation-fill-mode: forwards;
            }
        }
    }

    @keyframes becomeVisible {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes scaleUp {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    .cookie-banner {
        display: flex;
        flex-shrink: 0;
        width: 100%;
        max-width: min(600px, 90vw);
        min-height: 300px;
        max-height: 90vh;
        height: max-content;
        background: #fff;
        z-index: 1;
        border-radius: 2rem;
        overflow: hidden;
        pointer-events: all;


        & .image {
            display: block;
            width: 100%;
            max-height: 200px;
            overflow: hidden;
        }

        transform: scale(0);
        transform-origin: center;

        & .page {
            width: 100%;
            flex-shrink: 0;
            flex-grow: 0;
            transform: translateX(calc(-100% * v-bind(bannerPage)));
            transition: .2s linear;

            max-height: 100%;

            &.disabled {
                height: 20px;
            }
        }
    }

    @media (max-width: 550px) {
        .page {
            overflow-y: scroll;
        }
    }

    :deep(svg) {
        width: 100%;
        height: auto;
        transform: translateY(-5px);
    }

    .data-container {
        padding: 1.5rem;
        padding-bottom: 2rem;
        margin: 0;
        text-align: center;

        & h2 {
            margin: 0;
        }

        & h3 {
            text-align: left;
            margin-top: 2rem;
            margin-bottom: 0;
        }

        & p {
            font-size: .9rem;
            margin: 0;
            margin-top: .5rem;
            color: #6c6c6c;

            & a {
                text-decoration: underline;
                color: inherit;

                &:hover {
                    color: #000;
                    transition: .12s;
                }
            }
        }
    }

    button {
        display: block;
        margin-inline: auto;
    }

    button.concordo {
        margin-top: 3rem;
        padding: .8rem;
        border: transparent;
        background: #000;
        color: #fff;
        border-radius: 10000px;
        font-size: 1.2rem;
        cursor: pointer;
        padding-inline: 2rem;

        transition: .12s;

        &:hover {
            background: #212121;
        }
    }

    button.settings {
        margin-top: .8rem;
        border: transparent;
        background: transparent;
        cursor: pointer;
        color: #616161;
        font-size: .8rem;

        &:hover {
            color: #2c2c2c;
        }
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        & li {
            display: flex;
            margin-top: .5rem;
            text-align: left;
            align-items: center;

            &:deep(.inpt-container) {
                margin-left: auto;
            }

            & span {
                display: inline-block;
                width: calc(100% - 50px);
                text-align: left;
            }
        }
    }

    @media (max-width: 600px) {
        ul li {
            flex-direction: column;
            align-items: left;
            text-align: left;
            justify-content: left;
        }    

        ul li span {
            width: 100% !important;
        }

        :deep(.inpt-container) {
            margin-left: 0 !important;
            margin-right: auto;
            margin-bottom: .5rem;
            margin-top: .5rem;
        }
    }
</style>