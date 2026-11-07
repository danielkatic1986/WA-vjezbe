# WA – Vježba 1: Uvod u HTTP, Node i Express

Prvi Express.js poslužitelj izrađen u sklopu kolegija **Web aplikacije** (Sveučilište Jurja Dobrile u Puli, Fakultet informatike u Puli).

## Sadržaj

- [Zahtjevi](#zahtjevi)
- [Instalacija](#instalacija)
- [Pokretanje](#pokretanje)
- [Rute](#rute)
- [Struktura projekta](#struktura-projekta)
- [Testiranje](#testiranje)
- [Materijali](#materijali)

## Zahtjevi

- [Node.js](https://nodejs.org/) >= 20 (LTS)
- npm

## Instalacija

```bash
git clone https://github.com/danielkatic1986/WA-vjezbe.git
cd WA-vjezbe

# Instaliraj ovisnosti (express, nodemon)
npm install
```

## Pokretanje

```bash
# Produkcija
npm start

# Razvoj (auto-reload s nodemon)
npm run dev
```

Poslužitelj sluša na adresi **http://localhost:3000**.

## Rute

| Metoda | Ruta     | Tip odgovora | Opis                                                |
| ------ | -------- | ------------ | --------------------------------------------------- |
| GET    | `/`      | HTML         | Početna stranica s naslovom “Hello, Express!”       |
| GET    | `/about` | HTML         | Stranica “Ovo je stranica o nama!”                  |
| GET    | `/users` | JSON         | Popis korisnika (`id`, `ime`, `prezime`)            |

### Primjeri zahtjeva

```bash
# HTML stranice
curl http://localhost:3000/
curl http://localhost:3000/about

# JSON podaci
curl http://localhost:3000/users

# Prikaz cijelog HTTP odgovora (statusna linija + zaglavlja + tijelo)
curl -i http://localhost:3000/users
```

## Struktura projekta

```
.
├── index.js              # Express poslužitelj i definicije ruta
├── public/
│   ├── index.html        # HTML za rutu /
│   └── about.html        # HTML za rutu /about
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── wa-vjezbe-1/          # Materijali (PDF skripta)
```

## Testiranje

Rute je moguće testirati u web pregledniku, programom `curl` (vidi gore) ili u Postmanu:

1. Kreirajte novi request i odaberite metodu **GET**.
2. Unesite URL, npr. `http://localhost:3000/users`.
3. Kliknite **Send** i provjerite tijelo, statusni kod i zaglavlja odgovora.

## Materijali

- `wa-vjezbe-1/WA1 - Uvod u HTTP, Node i Express.pdf` – skripta s vježbama.

---

## Samostalni zadatak za Vježbu 1

Zadatak je implementiran na sljedeći način:

1. **GET `/`** – vraća HTML stranicu (`public/index.html`) s `<h1>` naslovom **“Hello, Express!”** pomoću metode `res.sendFile()`.
2. **GET `/about`** – vraća HTML stranicu (`public/about.html`) s `<h1>` naslovom **“Ovo je stranica o nama!”**.
3. **GET `/users`** – vraća polje od 3 korisnika u JSON formatu pomoću metode `res.json()`. Svaki korisnik ima atribute `id`, `ime` i `prezime`.

### Primjer odgovora `/users`

```json
[
  { "id": 1, "ime": "Ivan", "prezime": "Horvat" },
  { "id": 2, "ime": "Marija", "prezime": "Kovač" },
  { "id": 3, "ime": "Pero", "prezime": "Perić" }
]
```
