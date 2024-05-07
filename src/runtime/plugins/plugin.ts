import { defineNuxtPlugin, useNuxtApp } from '#app'

export default defineNuxtPlugin({
  name: 'hes-analytics',
  enforce: 'pre', // or 'post'
  hooks: {
      // You can directly register Nuxt app runtime hooks here
      'app:created'() {
            const nuxtApp = useNuxtApp()

            const options = nuxtApp.payload.config?.public.hes as any;

            append_google_analytics_script(options.gtag_id);
            append_google_tag_manager_script(options.gtag_id);
            append_hotjar_script(options.hotjar_id);
      },
  },
})

function append_google_analytics_script(analytics_id: string) {
  if (analytics_id.length < 1) {
      console.warn("Google tag id was not provided")
      return
  }   

  let GAnalyticsScript = document.createElement("script");
  GAnalyticsScript.type = "text/javascript"
  GAnalyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + analytics_id;

  document.head.appendChild(GAnalyticsScript);

  let GAnalyticsScript_2 = document.createElement("script");
  GAnalyticsScript_2.type = "text/javascript"
  GAnalyticsScript_2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });

        gtag('js', new Date());

        gtag('config', '${analytics_id}');
  `;

  document.head.appendChild(GAnalyticsScript_2);
}

function append_hotjar_script(analytics_id: string) {
  if (analytics_id.length < 1) {
      console.warn("Hotjar tracking id was not provided")
      return
  }   

  let hotjar_script = document.createElement("script");
  hotjar_script.type = "text/javascript"
  hotjar_script.innerHTML = `
      (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${analytics_id},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;

  document.head.appendChild(hotjar_script);
}

function append_google_tag_manager_script(id: string) {
  if (id.length < 1) {
      console.warn("Google tag manager tracking id was not provided")
      return
  }   

  let script = document.createElement("script");
  script.type = "text/javascript"
  script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
  `;

  let script_2 = document.createElement("noscript");
  script_2.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;

  document.head.appendChild(script);
  document.body.prepend(script_2);
}
