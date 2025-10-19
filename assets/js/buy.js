/* Lightweight Shopify “Buy” helper.
 *
 * Usage in HTML:
 *   <script>window.SHOPIFY_STORE_DOMAIN = "your-store.myshopify.com";</script>
 *   <button data-buy data-handle="single-feather">Adopt</button>
 *   OR
 *   <button data-buy data-url="https://your-store.myshopify.com/products/single-feather">Adopt</button>
 *
 * Optional:
 *   data-variant="1234567890"  // appends ?variant=...
 */

(function () {
  const domain = (window.SHOPIFY_STORE_DOMAIN || "").trim();

  function toUrlFromHandle(handle, variant) {
    if (!domain) return `/products/${handle}${variant ? `?variant=${variant}` : ""}`;
    return `https://${domain}/products/${handle}${variant ? `?variant=${variant}` : ""}`;
  }

  function go(url) {
    window.location.href = url;
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-buy]");
    if (!el) return;
    e.preventDefault();

    const directUrl = el.getAttribute("data-url");
    const handle = el.getAttribute("data-handle");
    const variant = el.getAttribute("data-variant");

    if (directUrl) return go(directUrl);
    if (handle) return go(toUrlFromHandle(handle, variant));

    console.warn("Buy button missing data-url or data-handle.");
  });
})();
