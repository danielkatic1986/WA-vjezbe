# Vježba 2 — REST API (agencija za nekretnine)

Rješenje druge vježbe kolegija **Web aplikacije**.

> Općenite informacije o kolegiju i pregled svih vježbi nalaze se u
> [korijenskom README-u](../README.md).

## Cilj vježbe

Izrada **REST API-ja** u Express.js-u za agenciju za nekretnine: modularno
organiziranje ruta pomoću `express.Router`, rad s JSON tijelom zahtjeva
(`express.json()`), implementacija CRUD operacija (`GET`, `POST`, `PUT`, `PATCH`,
`DELETE`), validacija ulaznih podataka te ispravno korištenje HTTP statusnih kodova.
Podaci se čuvaju u memoriji (polja u `data/podaci.js`), pa se resetiraju pri
svakom ponovnom pokretanju poslužitelja.

## Sadržaj direktorija

```
wa-vjezbe-2/
├── data/
│   └── podaci.js          # početni podaci (nekretnine i ponude)
├── routes/
│   ├── nekretnine.js      # CRUD rute za nekretnine
│   └── ponude.js          # rute za ponude
├── screenshotovi/         # Postman snimke testiranja (postman-1 … postman-15)
├── index.js               # Express poslužitelj
├── package.json
├── package-lock.json
└── README.md              # ovaj dokument
```

> `node_modules/` se ne pohranjuje u repozitorij — instalira se naredbom `npm install`.

## Tehnologije

- [Node.js](https://nodejs.org/) (LTS, ES moduli)
- [Express.js](https://expressjs.com/) 5
- [Postman](https://www.postman.com/) (testiranje)

## Pokretanje

```bash
npm install
npm start
```

Poslužitelj se pokreće na adresi **http://localhost:3000**.

## Modeli podataka

**Nekretnina**

```json
{
  "id": 1,
  "naziv": "Stan u centru",
  "opis": "Svijetli dvosobni stan blizu glavnog trga, renoviran 2022.",
  "cijena": 185000,
  "lokacija": "Pula",
  "broj_soba": 2,
  "povrsina": 58
}
```

**Ponuda**

```json
{
  "id": 1,
  "id_nekretnine": 1,
  "ime_kupca": "Ana",
  "prezime_kupca": "Anić",
  "ponudena_cijena": 175000,
  "telefon_kupca": "+385 91 123 4567"
}
```

## Rute

### Nekretnine — `/nekretnine`

| Metoda | Ruta               | Opis                                        | Uspjeh | Greške        |
| ------ | ------------------ | ------------------------------------------- | ------ | ------------- |
| GET    | `/nekretnine`      | Popis svih nekretnina                       | 200    | —             |
| GET    | `/nekretnine/:id`  | Dohvat nekretnine po ID-u                   | 200    | 400, 404      |
| POST   | `/nekretnine`      | Dodavanje nove nekretnine (sva polja)       | 201    | 400           |
| PUT    | `/nekretnine/:id`  | Potpuno ažuriranje (sva polja obavezna)     | 200    | 400, 404      |
| PATCH  | `/nekretnine/:id`  | Djelomično ažuriranje (barem jedno polje)   | 200    | 400, 404      |
| DELETE | `/nekretnine/:id`  | Brisanje nekretnine                         | 200    | 400, 404      |

### Ponude — `/ponude`

| Metoda | Ruta      | Opis                                  | Uspjeh | Greške   |
| ------ | --------- | ------------------------------------- | ------ | -------- |
| GET    | `/ponude` | Popis svih ponuda                     | 200    | —        |
| POST   | `/ponude` | Slanje nove ponude za nekretninu      | 201    | 400, 404 |

## Validacija

- **ID** u putanji mora biti broj, inače `400`.
- Nepostojeća nekretnina (ID u putanji ili `id_nekretnine` u ponudi) → `404`.
- Nedostaju obavezna polja → `400`.
- `cijena` – broj, ne smije biti negativna.
- `broj_soba` – cijeli broj, ne smije biti negativan.
- `povrsina` – broj veći od 0.
- Ponuda: `id_nekretnine` mora biti broj, `ponudena_cijena` broj veći od 0.

Greške se vraćaju u obliku `{ "message": "opis greške" }`.

## Primjeri zahtjeva

```bash
# sve nekretnine
curl http://localhost:3000/nekretnine

# nova nekretnina
curl -X POST http://localhost:3000/nekretnine \
  -H "Content-Type: application/json" \
  -d '{"naziv":"Vila s bazenom","opis":"Moderna vila s pogledom na more.","cijena":650000,"lokacija":"Poreč","broj_soba":5,"povrsina":220}'

# djelomično ažuriranje cijene
curl -X PATCH http://localhost:3000/nekretnine/3 \
  -H "Content-Type: application/json" \
  -d '{"cijena":95000}'

# brisanje
curl -X DELETE http://localhost:3000/nekretnine/2

# nova ponuda
curl -X POST http://localhost:3000/ponude \
  -H "Content-Type: application/json" \
  -d '{"id_nekretnine":2,"ime_kupca":"Marko","prezime_kupca":"Marić","ponudena_cijena":320000,"telefon_kupca":"+385 98 765 4321"}'
```

## Testiranje u Postmanu

Snimke zaslona testiranja ruta (uspješni zahtjevi i slučajevi s greškom):

![Postman – primjer 1](./screenshotovi/postman-1.png)

![Postman – primjer 2](./screenshotovi/postman-2.png)

![Postman – primjer 3](./screenshotovi/postman-3.png)

![Postman – primjer 4](./screenshotovi/postman-4.png)

![Postman – primjer 5](./screenshotovi/postman-5.png)

![Postman – primjer 6](./screenshotovi/postman-6.png)

![Postman – primjer 7](./screenshotovi/postman-7.png)

![Postman – primjer 8](./screenshotovi/postman-8.png)

![Postman – primjer 9](./screenshotovi/postman-9.png)

![Postman – primjer 10](./screenshotovi/postman-10.png)

![Postman – primjer 11](./screenshotovi/postman-11.png)

![Postman – primjer 12](./screenshotovi/postman-12.png)

![Postman – primjer 13](./screenshotovi/postman-13.png)

![Postman – primjer 14](./screenshotovi/postman-14.png)

![Postman – primjer 15](./screenshotovi/postman-15.png)
