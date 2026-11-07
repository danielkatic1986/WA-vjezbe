# Web aplikacije — Vježba 1

Repozitorij sadrži rješenja vježbi iz kolegija **Web aplikacije**. Ovaj direktorij
(`wa-vjezbe-1`) sadrži materijale i kod za **prvu vježbu**.

## O kolegiju

| | |
| --- | --- |
| **Kolegij** | Web aplikacije (WA – 199769) |
| **Ustanova** | Sveučilište Jurja Dobrile u Puli, Fakultet informatike u Puli |
| **Nositelj** | doc. dr. sc. Nikola Tanković |
| **Asistent** | Luka Blašković, mag. inf. |

Kolegij se bavi razvojem **poslužiteljskog sloja** web aplikacija korištenjem
**Node.js-a** i web okvira **Express.js**.

## Tema prve vježbe

**Uvod u HTTP, Node i Express** — upoznavanje s alatima (Node.js, VS Code, Git),
inicijalizacija Node projekta, postavljanje osnovnog Express poslužitelja te osnove
HTTP protokola (zahtjev, odgovor, statusni kodovi).

## Sadržaj direktorija

```
wa-vjezbe-1/
├── WA1 - Uvod u HTTP, Node i Express.pdf   # skripta/slajdovi prve vježbe
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

| Metoda | Ruta     | Odgovor | Opis                                  |
| ------ | -------- | ------- | ------------------------------------- |
| GET    | `/`      | HTML    | Početna stranica                      |
| GET    | `/about` | HTML    | Stranica o nama                       |
| GET    | `/users` | JSON    | Popis korisnika (`id`, `ime`, `prezime`) |

### Testiranje

```bash
curl http://localhost:3000/
curl http://localhost:3000/about
curl http://localhost:3000/users
```

Rute je moguće testirati i u web pregledniku te u Postmanu.
