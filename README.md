# Vaskerum 🫧

Simpelt bookingsystem til to vaskemaskiner. Ingen database, ingen konti — bare en Node.js-server og en JSON-fil.

## Krav

- [Node.js](https://nodejs.org/) version 18 eller nyere

## Kom i gang

```bash
# 1. Installer afhængigheder
npm install

# 2. Start serveren
npm start
```

Åbn derefter http://localhost:3000 i din browser.

## Konfiguration

| Miljøvariabel | Standard | Beskrivelse |
|---|---|---|
| `PORT` | `3000` | Hvilken port serveren lytter på |

Eksempel: `PORT=8080 npm start`

## Data

Bookinger gemmes i filen `bookings.json` i projektmappen. Filen oprettes automatisk første gang.
Lejlighedsnumre gemmes lokalt i den enkelte browsers `localStorage` — intet persondata sendes til serveren.

---

## Deploy-muligheder

### Mulighed 1 – Lokal server / hjemme-NAS / Raspberry Pi

```bash
npm install
npm start
```

Del adressen `http://DIN-IP:3000` med dine naboer via WiFi.

---

### Mulighed 2 – Railway (gratis, anbefalet til cloud)

1. Opret konto på [railway.app](https://railway.app)
2. Tryk **New Project → Deploy from GitHub repo**
3. Upload eller push koden til et GitHub-repo
4. Railway finder automatisk `npm start` og starter serveren
5. Du får en gratis `.railway.app`-URL

> **Vigtigt:** Railway's filsystem er midlertidigt — `bookings.json` nulstilles ved genstart.  
> For permanent lagring: tilføj en PostgreSQL-database via Railway's plugin, eller brug Mulighed 4.

---

### Mulighed 3 – Render (gratis tier)

1. Opret konto på [render.com](https://render.com)
2. **New → Web Service → Connect a repository**
3. Build command: `npm install`  
   Start command: `npm start`
4. Du får en gratis `.onrender.com`-URL

> Samme forbehold som Railway: disk nulstilles ved spin-down.

---

### Mulighed 4 – VPS / server (anbefalet til vedvarende data)

På en Ubuntu/Debian-server:

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Klon/upload projektet, derefter:
npm install

# Kør med PM2 (holder den kørende ved genstart)
npm install -g pm2
pm2 start server.js --name vaskerum
pm2 save
pm2 startup
```

Sæt Nginx op foran med en rigtig domæne og HTTPS via Let's Encrypt.

---

### Mulighed 5 – Fly.io (gratis, Docker-baseret)

Projektet inkluderer en `Dockerfile`. Deploy med:

```bash
fly launch
fly deploy
```

Bookings overlever genstarter via Fly's persistente volumen (konfigurér i `fly.toml`).

---

## Tilpasning

Vil du ændre antallet af maskiner, åbningstider, eller sproget til engelsk?  
Al logik er i `public/index.html` (frontend) og `server.js` (backend) — begge filer er velkommenterede.

| Hvad | Hvor |
|---|---|
| Antal maskiner | `public/index.html` → tabs + `HOURS` array |
| Åbningstider | `public/index.html` → `const HOURS = ...` |
| Antal uger fremad | `public/index.html` → `addDays(new Date(), 21)` |
| Sprog | Tekster i `public/index.html` |
