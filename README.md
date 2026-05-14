# Mirava — Free Mirrors & Connectivity Dashboard

> Fast, free, and uncensored access to Linux mirrors, programming libraries, and essential tools.

---

## ✨ Features

- 🌐 Browse **Iranian & global mirrors** in a searchable grid
- 📡 **Real-time per-package status** — green/red per endpoint, refreshed every 15s
- 📊 **24-hour uptime dashboard** — compare mirrors at a glance
- 📋 One-click **copy mirror URL**
- 💡 Community-driven — suggest, vote, and contribute

---

## 🚀 Quick Start

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in your browser — no build step needed.

---

## 🤝 Contributing

Check [open issues](https://github.com/MiravaOrg/mirava/issues) before starting.

**Where to help:**

| Area | Difficulty |
|------|-----------|
| Add/fix mirrors in `mirror.json` | 🟢 Easy |
| Add `packageUrls` for per-package status | 🟢 Easy |
| Improve Persian or add translations | 🟢 Easy |
| CSS / responsiveness / dark-mode | 🟡 Medium |
| Status check heuristics | 🟡 Medium |
| Admin panel (`admin.html`) | 🟡 Medium |
| Performance & batching | 🔴 Hard |

**How:**
1. Fork → branch (`feat/your-change`) → change → PR

### 📝 PR & Issue title format

```
[area]: short description
```

```
[mirror-data]: add Arvan Cloud mirror
[css]: fix mobile layout on dashboard
[translation]: add Persian error strings
[admin]: add bulk-approve to queue
[bug]: fix package filter returning no results
[docs]: clarify packageUrls field
```

**Area tags:** `mirror-data` · `css` · `translation` · `status` · `admin` · `performance` · `bug` · `docs`

### Adding a mirror

```json
{
  "name": "Mirror Name",
  "url": "https://mirror.example.ir",
  "description": "Short description",
  "packages": ["Ubuntu", "Debian"],
  "packageUrls": [
    { "name": "Ubuntu", "url": "https://mirror.example.ir/ubuntu/" }
  ]
}
```

---

## ⚠️ Known Issues

- **CORS** — we detect if a server responds, not whether it serves valid content
- **No `packageUrls` coverage** — most mirrors lack per-package endpoints
- **ISP variance** — status is checked from the user's own network
- **Admin auth** — password is hardcoded in `admin.html`; change it if self-hosting
- **localStorage only** — uptime history resets on new browser or cleared storage

---

## 🛠 Tech Stack

`HTML` · `CSS` · `Vanilla JS` · `mirror.json` · `localStorage` · `Fetch API`

---

## 📄 License

Open Source — Freedom Through Access
