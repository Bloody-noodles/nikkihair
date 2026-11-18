# Nikihairstyles — Static Website

Plain HTML, CSS and vanilla JavaScript. No build step, backend or package dependencies. Open `index.html` in a browser or deploy the folder to a static host.

## Campaign demo

The December Edit is a presentation concept. Crossed-out prices, sale prices and gift offers are samples; confirm real prices, inventory, offer terms and campaign dates with the business before publishing them as live promotions.

The salon and client photos supplied for this site are used as local assets. Images described as illustrative are stock demo references and are not Nikkihairstyles client results. Some illustrative service photos and the Google Fonts stylesheet load from the internet.

## Before using as a live business site

- Confirm current service names, prices, product specifications, stock and promo terms.
- Confirm appointment location details and opening hours; the page currently says Uyo and by appointment.
- Replace illustrative beauty, nails and pedicure photos with Nikkihairstyles work when available.
- Confirm the WhatsApp number and Instagram profile.

## Structure

    index.html        — page content and metadata
    css/style.css     — design system and responsive layout
    js/script.js      — navigation, gallery, scroll effects and WhatsApp booking
    images/           — salon photos, promo references and transition videos

## Booking flow

The booking form validates the request and opens WhatsApp with a pre-written message. It does not store or send information to a server. Niki confirms availability and appointment details in WhatsApp. Product enquiries can omit an appointment date.
