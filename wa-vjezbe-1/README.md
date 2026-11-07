# Vježba 1 — Uvod u HTTP, Node i Express

Rješenje prve vježbe kolegija **Web aplikacije**.

> Općenite informacije o kolegiju i pregled svih vježbi nalaze se u
> [korijenskom README-u](../README.md).

## Cilj vježbe

Upoznavanje s alatima (Node.js, VS Code, Git) i inicijalizacija Node projekta,
postavljanje osnovnog **Express.js** poslužitelja te osnove **HTTP protokola**
(zahtjev, odgovor, statusni kodovi, metode).

## Sadržaj direktorija

```
wa-vjezbe-1/
├── WA1 - Uvod u HTTP, Node i Express.pdf   # skripta prve vježbe
├── index.js                                # Express poslužitelj (definicije ruta)
├── public/                                 # statične HTML stranice
│   ├── index.html
│   └── about.html
├── package.json                            # konfiguracija i ovisnosti projekta
├── package-lock.json                       # zaključane verzije ovisnosti
└── README.md                               # ovaj dokument
```

> `node_modules/` se ne pohranjuje u repozitorij — instalira se naredbom `npm install`.

## Tehnologije

- [Node.js](https://nodejs.org/) (LTS)
- [Express.js](https://expressjs.com/)
- [nodemon](https://nodemon.io/) (razvoj)

## Pokretanje

```bash
# Instalacija ovisnosti
npm install

# Razvoj (auto-reload)
npm run dev

# Produkcija
npm start
```

Poslužitelj se pokreće na adresi **http://localhost:3000**.

## Rute

| Metoda | Ruta     | Odgovor | Opis                                     |
| ------ | -------- | ------- | ---------------------------------------- |
| GET    | `/`      | HTML    | Početna stranica (`public/index.html`)   |
| GET    | `/about` | HTML    | Stranica o nama (`public/about.html`)    |
| GET    | `/users` | JSON    | Popis korisnika (`id`, `ime`, `prezime`) |

### Testiranje

```bash
curl http://localhost:3000/
curl http://localhost:3000/about
curl http://localhost:3000/users
```

Rute je moguće testirati i u web pregledniku te u Postmanu.
