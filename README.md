# Nikihairstyles — Static Website

Plain HTML + CSS + vanilla JavaScript. No build step, no backend, no dependencies.
Just open `index.html` in a browser, or drop the folder on any static host.

## Host it free (pick one)

- **Netlify** (easiest): app.netlify.com/drop — drag this folder onto the page. Live URL in ~30s.
- **Vercel**: `npx vercel` inside this folder, or import the folder on vercel.com.
- **GitHub Pages**: push the folder to a repo → Settings → Pages → deploy from branch.

## Before showing the client

1. **Replace demo photos** in `images/` with her real work (from her Instagram @nikihairstyles50).
   Keep the same file names, or update the `src` attributes in `index.html`.
2. **Confirm services & prices** — edit the cards in the Services section of `index.html`.
   Swap "Price on request" for real prices once she confirms them.
3. **Facebook link** — the footer Facebook link is a placeholder; point it to her
   "Nikihairstyles Justina" Facebook page.
4. **WhatsApp number** is set in `js/script.js` (`WHATSAPP_NUMBER = "2347040569047"`).

## Structure

    index.html        — all sections (hero, services, gallery, about, booking, footer)
    css/style.css     — full design system (pink/blush theme, responsive)
    js/script.js      — nav, reveal animations, gallery filters + lightbox, WhatsApp booking
    images/           — photos (currently demo placeholders)

## How booking works

The form validates input, then opens WhatsApp with a pre-written message.
Nothing is stored or sent to a server — the request lands in her WhatsApp chat
and she confirms the slot manually. Instagram DM is offered as an alternative.
