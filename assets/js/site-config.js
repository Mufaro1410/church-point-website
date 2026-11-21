/* Edit this file to change prices, links and contact details. No rebuild needed. */
window.SITE = {
  name: "Church Point",
  adminUrl: "https://admin.churchpointorg.com",
  email: "churchpointorg@gmail.com",
  whatsapp: "",            // e.g. "263771234567" (digits only, with country code). Leave empty to hide the WhatsApp button.
  playUrl: "https://play.google.com/store/apps/details?id=com.mufaro1410.churchpoint",
  appStoreUrl: "",         // paste your App Store link (https://apps.apple.com/app/...) when you have it
  formEndpoint: "",        // optional: a form service address (e.g. https://formspree.io/f/xxxx). Empty = opens the visitor's email app
  annualMonthsFree: 2,     // pay yearly, get this many months free. Set 0 to hide.
  tiers: [
    { name: "Starter", members: "Up to 100 members", price: 20, blurb: "Small congregations and church plants." },
    { name: "Growth", members: "Up to 300 members", price: 40, blurb: "Established churches with several groups.", popular: true },
    { name: "Large", members: "Up to 750 members", price: 75, blurb: "Large congregations with many ministries." },
    { name: "Custom", members: "750+ members or several churches", price: null, blurb: "Provinces, districts and multi-church setups." }
  ]
};
