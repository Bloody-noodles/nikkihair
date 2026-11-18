/* Nikihairstyles — vanilla JS
   1. sticky nav state
   2. mobile menu
   3. scroll reveal
   4. gallery filters + lightbox
   5. booking form -> prefilled WhatsApp message
   6. floating WhatsApp button visibility
*/
(function () {
  "use strict";

  /* ---------- 1. sticky nav ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. mobile menu ---------- */
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    links.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- 3. scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Play the transition while it is in view, and pause it when scrolled away. */
  const transitionVideos = Array.from(document.querySelectorAll(".gallery__video-card video"));
  if (transitionVideos.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && !document.hidden) {
          transitionVideos.forEach((otherVideo) => {
            if (otherVideo !== video) otherVideo.pause();
          });
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.45 });
    transitionVideos.forEach((video) => videoObserver.observe(video));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        transitionVideos.forEach((video) => video.pause());
        return;
      }
      const visibleVideo = transitionVideos.find((video) => {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        return rect.height && visibleHeight / rect.height >= 0.45;
      });
      transitionVideos.forEach((video) => {
        if (video === visibleVideo) video.play().catch(() => {});
        else video.pause();
      });
    });
  }

  /* ---------- 4. gallery filters + lightbox ---------- */
  const chips = document.querySelectorAll("#galleryFilters .chip");
  const items = Array.from(document.querySelectorAll(".gallery__item"));
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const f = chip.dataset.filter;
      items.forEach((it) => it.classList.toggle("hide", f !== "all" && it.dataset.cat !== f));
    })
  );

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  let visible = [];
  let idx = 0;

  const renderLightbox = () => {
    const it = visible[idx];
    const img = it.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = it.querySelector("figcaption").textContent;
  };
  const openLightbox = (item) => {
    visible = items.filter((i) => !i.classList.contains("hide"));
    idx = visible.indexOf(item);
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  items.forEach((it) => it.addEventListener("click", () => openLightbox(it)));
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => {
    idx = (idx - 1 + visible.length) % visible.length; renderLightbox();
  });
  document.getElementById("lightboxNext").addEventListener("click", () => {
    idx = (idx + 1) % visible.length; renderLightbox();
  });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") document.getElementById("lightboxPrev").click();
    if (e.key === "ArrowRight") document.getElementById("lightboxNext").click();
  });

  /* ---------- 5. booking form -> WhatsApp ---------- */
  const WHATSAPP_NUMBER = "2347040569047"; // Nikihairstyles
  const form = document.getElementById("bookingForm");
  const errEl = document.getElementById("bkError");
  const dateInput = document.getElementById("bkDate");
  const serviceInput = document.getElementById("bkService");
  const dateLabel = dateInput.closest("label").querySelector("span");
  const timeField = document.getElementById("bkTime").closest(".field");
  const timeLabel = timeField.querySelector("span");
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  dateInput.min = localToday.toISOString().split("T")[0]; // no past dates in the visitor's local timezone

  const isProductOrder = () => serviceInput.value.startsWith("Hair Purchase");
  const updateRequestFields = () => {
    const productOrder = isProductOrder();
    dateInput.required = !productOrder;
    dateLabel.textContent = productOrder ? "Preferred date (optional)" : "Preferred date *";
    timeLabel.textContent = productOrder ? "Preferred time (optional)" : "Preferred time *";
  };
  serviceInput.addEventListener("change", updateRequestFields);
  updateRequestFields();

  const niceDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const service = serviceInput.value;
    const productOrder = isProductOrder();
    const date = dateInput.value;
    const time = form.querySelector('input[name="bkTime"]:checked').value;
    const name = document.getElementById("bkName").value.trim();
    const note = document.getElementById("bkNote").value.trim();

    let err = "";
    if (!service) err = "Please choose a service or hair product.";
    else if (!productOrder && !date) err = "Please pick a preferred date.";
    else if (!name) err = "Please enter your name.";
    errEl.textContent = err;
    if (err) return;

    const lines = [
      productOrder
      ? "Hello Nikihairstyles! I'd like to ask about a hair product."
        : "Hello Nikihairstyles! I'd like to book a service.",
      "",
      "Name: " + name,
      "Interested in: " + service,
    ];
    if (date) lines.push((productOrder ? "Preferred date: " : "Appointment date: ") + niceDate(date));
    if (date && !productOrder) lines.push("Preferred time: " + time);
    if (note) lines.push("Details: " + note);
    lines.push("I can send a reference photo or product inspiration here if helpful.");
    lines.push("", "(Sent from your website)");

    window.open(
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener"
    );
  });

  /* ---------- 6. floating WhatsApp button ---------- */
  const waFloat = document.querySelector(".wa-float");
  window.addEventListener(
    "scroll",
    () => waFloat.classList.toggle("show", window.scrollY > 350),
    { passive: true }
  );

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
