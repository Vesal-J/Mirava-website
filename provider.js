const translations = {
  fa: {
    navHome: "خانه",
    navAbout: "درباره",
    navDonate: "حمایت",
    backToList: "← بازگشت به فهرست میرورها",
    online: "آنلاین",
    offline: "آفلاین",
    checking: "در حال بررسی",
    copyUrl: "کپی آدرس",
    copied: "لینک کپی شد.",
    packages: "پکیج‌ها و مخازن",
    liveStatus: "وضعیت زنده",
    country: "کشور",
    sourceOriginal: "منبع اصلی",
    sourceMirrorIr: "میرور ایران",
    sourceMirrorIntl: "میرور بین‌المللی",
    notFound: "میرور پیدا نشد",
    notFoundDesc: "میروری با این آدرس در فهرست وجود ندارد.",
    visitWebsite: "مشاهده وب‌سایت",
    loadError: "خطا در بارگذاری اطلاعات.",
    noPackages: "پکیجی ثبت نشده",
  },
  en: {
    navHome: "Home",
    navAbout: "About",
    navDonate: "Donate",
    backToList: "← Back to mirror list",
    online: "Online",
    offline: "Offline",
    checking: "Checking",
    copyUrl: "Copy URL",
    copied: "Link copied.",
    packages: "Packages & Repositories",
    liveStatus: "Live status",
    country: "Country",
    sourceOriginal: "Original Source",
    sourceMirrorIr: "Iran Mirror",
    sourceMirrorIntl: "Intl Mirror",
    notFound: "Mirror not found",
    notFoundDesc: "No mirror with this URL exists in the directory.",
    visitWebsite: "Visit website",
    loadError: "Failed to load data.",
    noPackages: "No packages listed",
  },
};

let currentLang = localStorage.getItem("mirava-lang") || "fa";

function t(key) {
  return translations[currentLang][key] || key;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  document.getElementById("langToggle").textContent =
    currentLang === "fa" ? "EN" : "FA";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function showToast() {
  const toast = document.getElementById("copyToast");
  const msg = document.getElementById("copyToastText");
  if (msg) msg.textContent = t("copied");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function copyUrl(url) {
  navigator.clipboard.writeText(url).then(showToast).catch(showToast);
}

function checkMirror(url, timeout = 4500) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout);
    fetch(url, { mode: "no-cors", cache: "no-store" })
      .then(() => { clearTimeout(timer); resolve(true); })
      .catch(() => { clearTimeout(timer); resolve(false); });
  });
}

function statusLabel(s) {
  if (s === "up") return t("online");
  if (s === "down") return t("offline");
  return t("checking");
}

function sourceLabel(type) {
  if (type === "original") return t("sourceOriginal");
  if (type === "mirror-intl") return t("sourceMirrorIntl");
  return t("sourceMirrorIr");
}

function renderProvider(mirror, statuses) {
  const container = document.getElementById("providerDetail");
  const sourceType = mirror.sourceType || "mirror-ir";
  const mainStatus = statuses[mirror.url] ?? "checking";

  const countryBadge = mirror.country
    ? `<span class="provider-country">🌐 ${mirror.country}</span>`
    : "";

  const pkgItems = (mirror.packageUrls && mirror.packageUrls.length
    ? mirror.packageUrls.map((pkg) => {
        const s = statuses[pkg.url] ?? "checking";
        return `
          <a class="provider-pkg-item pkg-${s}" href="${pkg.url}" target="_blank" rel="noopener" title="${pkg.url}">
            <span class="provider-pkg-dot"></span>
            ${pkg.name}
            <span class="status-pill ${s}" style="font-size:0.6rem;padding:0.1rem 0.4rem;">${statusLabel(s)}</span>
          </a>`;
      })
    : mirror.packages.map((pkg) =>
        `<span class="provider-pkg-item pkg-${mainStatus}">
          <span class="provider-pkg-dot"></span>
          ${pkg}
        </span>`,
      )
  ).join("");

  container.innerHTML = `
    <a href="index.html" class="provider-back">${t("backToList")}</a>

    <article class="provider-card glass">
      <div class="provider-header">
        <div class="provider-title-group">
          <div class="provider-badges">
            <span class="source-tag source-${sourceType}">${sourceLabel(sourceType)}</span>
            ${countryBadge}
          </div>
          <h1>${mirror.name}</h1>
        </div>
        <span class="status-pill ${mainStatus}" style="font-size:0.85rem;padding:0.3rem 0.85rem;">${statusLabel(mainStatus)}</span>
      </div>

      <p class="provider-desc">${mirror.description}</p>

      <div class="provider-url-row">
        <a href="${mirror.url}" target="_blank" rel="noopener">${mirror.url}</a>
        <button class="provider-copy-btn" id="copyBtn">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/>
          </svg>
          ${t("copyUrl")}
        </button>
      </div>

      <p class="provider-section-label">${t("packages")}</p>
      <div class="provider-packages-grid">
        ${pkgItems || `<span style="color:var(--text-muted);font-size:0.85rem;">${t("noPackages")}</span>`}
      </div>
    </article>
  `;

  document.getElementById("copyBtn").addEventListener("click", () =>
    copyUrl(mirror.url),
  );
}

function renderNotFound(url) {
  const container = document.getElementById("providerDetail");
  container.innerHTML = `
    <a href="index.html" class="provider-back">${t("backToList")}</a>
    <div class="provider-not-found">
      <h2>${t("notFound")}</h2>
      <p>${t("notFoundDesc")}</p>
      ${url ? `<p style="margin-top:0.5rem;font-size:0.8rem;opacity:0.6;">${url}</p>` : ""}
    </div>
  `;
}

async function init() {
  applyLang();

  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get("url");

  if (!targetUrl) {
    renderNotFound("");
    return;
  }

  let mirror = null;
  try {
    const response = await fetch("mirror.json");
    const data = await response.json();
    const all = [
      ...(data.official_iran_mirrors || []),
      ...(data.global_mirrors || []),
    ];
    mirror = all.find((m) => m.url === targetUrl);
  } catch {
    document.getElementById("providerDetail").innerHTML =
      `<a href="index.html" class="provider-back">${t("backToList")}</a><p class="empty-state">${t("loadError")}</p>`;
    return;
  }

  if (!mirror) {
    renderNotFound(targetUrl);
    return;
  }

  document.title = `Mirava — ${mirror.name}`;

  const urlsToCheck = [mirror.url];
  if (mirror.packageUrls) {
    mirror.packageUrls.forEach((pkg) => urlsToCheck.push(pkg.url));
  }

  const statuses = {};
  urlsToCheck.forEach((u) => (statuses[u] = "checking"));
  renderProvider(mirror, statuses);

  const results = await Promise.all(
    urlsToCheck.map(async (u) => ({ url: u, online: await checkMirror(u) })),
  );
  results.forEach(({ url, online }) => {
    statuses[url] = online ? "up" : "down";
  });
  renderProvider(mirror, statuses);
}

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "fa" ? "en" : "fa";
  localStorage.setItem("mirava-lang", currentLang);
  applyLang();
  init();
});

init();
