# Vježba 3 — Razmjena podataka između klijenta i poslužitelja (Pizza Express)

Rješenje treće vježbe kolegija **Web aplikacije**.

> Općenite informacije o kolegiju i pregled svih vježbi nalaze se u
> [korijenskom README-u](../README.md).

## Cilj vježbe

Izrada web aplikacije za **naručivanje pizza** koja se sastoji od dva dijela:
**Express.js poslužitelja** (backend) i **Vue 3 klijentske aplikacije** (frontend)
stilizirane TailwindCSS-om. Naglasak je na komunikaciji između klijenta i
poslužitelja: slanje HTTP zahtjeva iz preglednika pomoću **Axiosa**, konfiguracija
**CORS** politike na poslužitelju, dinamičko iscrtavanje podataka dohvaćenih s
poslužitelja te slanje narudžbi `POST` zahtjevom.

Uz implementaciju iz skripte riješeni su i dodatni zadaci:

1. **Unos podataka za dostavu** – obrazac s validacijom umjesto podataka upisanih u kod.
2. **Brisanje stavki iz košarice** prije slanja narudžbe.
3. **Prikaz statusa narudžbe** unutar aplikacije (umjesto `alert()`), s porukom dohvaćenom s poslužitelja.
4. **Stranica s detaljima pizze** na adresi `/pizze/:naziv` (Vue Router), s gumbom „Natrag na popis".

Podaci se čuvaju u memoriji poslužitelja (polja u `data/data.js`), pa se resetiraju
pri svakom ponovnom pokretanju.

## Sadržaj direktorija

```
wa-vjezbe-3/
├── pizza-express/                # backend (Express.js)
│   ├── data/
│   │   └── data.js               # pizze i narudžbe (in-memory)
│   ├── routes/
│   │   ├── pizze.js              # GET /pizze, GET /pizze/:naziv
│   │   └── narudzbe.js           # POST /narudzbe, GET /narudzbe + validacija
│   ├── index.js                  # Express poslužitelj (CORS, JSON, routeri)
│   ├── package.json
│   └── package-lock.json
├── pizza-vue/                    # frontend (Vue 3 + Vite + TailwindCSS 4)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── tailwind.css      # uvoz TailwindCSS-a
│   │   ├── components/
│   │   │   ├── Header.vue        # zaglavlje s bedžom košarice
│   │   │   ├── PizzaList.vue     # popis pizza (GET /pizze)
│   │   │   ├── PizzaDetalji.vue  # detalji pizze (GET /pizze/:naziv)
│   │   │   ├── OrderFooter.vue   # odabir veličine/količine, košarica, obrazac, slanje
│   │   │   └── Obavijest.vue     # obavijest o statusu narudžbe
│   │   ├── router/
│   │   │   └── index.js          # rute: / i /pizze/:naziv
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── kosarica.js           # dijeljeno stanje košarice i podataka za dostavu
│   │   ├── obavijest.js          # dijeljeno stanje obavijesti
│   │   └── ikone.js              # mapa sastojak → ikona
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
└── README.md                     # ovaj dokument
```

> `node_modules/` se ne pohranjuje u repozitorij — instalira se naredbom `npm install`
> u svakom od dva direktorija.

## Tehnologije

**Backend**

- [Node.js](https://nodejs.org/) (LTS, ES moduli)
- [Express.js](https://expressjs.com/) 5
- [cors](https://www.npmjs.com/package/cors) – CORS middleware

**Frontend**

- [Vue.js](https://vuejs.org/) 3 (`<script setup>`, Composition API)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vite.dev/) – razvojni poslužitelj i build alat
- [TailwindCSS](https://tailwindcss.com/) 4
- [Axios](https://axios-http.com/) – HTTP klijent
- [Oh, Vue Icons!](https://oh-vue-icons.js.org/) – ikone sastojaka

**Testiranje**

- [Postman](https://www.postman.com/)

## Pokretanje

Potrebna su **dva terminala** – jedan za poslužitelj, drugi za klijentsku aplikaciju.

**Backend**

```bash
cd pizza-express
npm install
npx nodemon index.js
```

Poslužitelj se pokreće na adresi **http://localhost:3000**.

**Frontend**

```bash
cd pizza-vue
npm install
npm run dev
```

Aplikacija je dostupna na adresi **http://localhost:5173**.

> CORS na poslužitelju dopušta zahtjeve samo s `http://localhost:5173`, pa frontend
> mora biti pokrenut na tom portu.

## Modeli podataka

**Pizza**

```json
{
  "id": 1,
  "naziv": "Margherita",
  "sastojci": ["rajčica", "sir", "bosiljak"],
  "cijene": { "mala": 7.3, "srednja": 9.2, "jumbo": 16.2 },
  "slika_url": "https://..."
}
```

**Narudžba** (tijelo `POST /narudzbe` zahtjeva)

```json
{
  "narucene_pizze": [
    { "naziv": "Margherita", "velicina": "srednja", "kolicina": 2 },
    { "naziv": "Fantasia", "velicina": "jumbo", "kolicina": 1 }
  ],
  "podaci_dostava": {
    "prezime": "Perić",
    "adresa": "Zagrebačka 15, Pula",
    "telefon": "091234567"
  }
}
```

Ukupnu cijenu narudžbe **računa poslužitelj** na temelju svojih podataka o pizzama –
cijena se ne prima od klijenta.

## Rute

### Pizze — `/pizze`

| Metoda | Ruta             | Opis                                   | Uspjeh | Greške |
| ------ | ---------------- | -------------------------------------- | ------ | ------ |
| GET    | `/pizze`         | Popis svih pizza                       | 200    | 404    |
| GET    | `/pizze/:naziv`  | Dohvat pizze po nazivu (neovisno o velikim/malim slovima) | 200 | 404 |

### Narudžbe — `/narudzbe`

| Metoda | Ruta        | Opis                                        | Uspjeh | Greške |
| ------ | ----------- | ------------------------------------------- | ------ | ------ |
| POST   | `/narudzbe` | Nova narudžba (poslužitelj računa ukupno)   | 201    | 400    |
| GET    | `/narudzbe` | Popis svih zaprimljenih narudžbi            | 200    | —      |

## Validacija

**Poslužitelj**

- `narucene_pizze` mora biti neprazno polje, inače `400`.
- Svaka stavka mora imati **točno** polja `naziv`, `velicina` i `kolicina` (bez viška).
- Pizza mora postojati, a odabrana veličina mora postojati za tu pizzu.
- `kolicina` mora biti cijeli broj veći od 0.
- `podaci_dostava` mora imati **točno** polja `prezime`, `adresa` i `telefon`, i nijedno ne smije biti prazno.

Greške se vraćaju u obliku `{ "message": "opis greške" }` (kod neispravnih pizza uz
dodatni objekt `validacija` s popisom problema).

**Klijent** (obrazac za dostavu)

- `prezime` – barem 2 slova (dopuštena hrvatska slova, razmak, crtica i apostrof).
- `adresa` – barem 5 znakova.
- `telefon` – 6 do 15 znamenki, uz opcionalni `+` na početku (razmaci, `/` i `-` se zanemaruju).

Greške se prikazuju ispod polja nakon prvog pokušaja slanja i nestaju čim se podatak ispravi.

## Funkcionalnosti klijentske aplikacije

- Dohvat i prikaz pizza s poslužitelja (slika, sastojci s ikonama, cijene po veličini),
  uz stanje učitavanja i prikaz greške ako poslužitelj nije dostupan.
- Odabir pizze, veličine i količine uz automatski izračun cijene.
- **Košarica** kao dijeljeno stanje (`kosarica.js`) – ne gubi se zatvaranjem izbornika ni
  prelaskom na drugu stranicu; ista pizza iste veličine spaja se u jednu stavku.
- Bedž s brojem komada u zaglavlju; klik na ikonu košarice otvara košaricu.
- Brisanje pojedinačnih stavki iz košarice.
- Obrazac za podatke za dostavu s validacijom; slanje i tipkom Enter.
- Obavijest o statusu narudžbe s **porukom i ukupnom cijenom s poslužitelja**; gumb je
  onemogućen dok zahtjev traje (zaštita od dvostrukog slanja).
- Stranica s detaljima pizze (`/pizze/:naziv`) s mogućnošću dodavanja u košaricu i
  porukom s poslužitelja za nepostojeću pizzu.
- Zatvaranje izbornika gumbom × ili tipkom `Esc`.
- Responzivni dizajn (mobitel, tablet, desktop).

## Primjeri zahtjeva

```bash
# sve pizze
curl http://localhost:3000/pizze

# jedna pizza (razmak u nazivu kodira se kao %20)
curl http://localhost:3000/pizze/Al%20Tonno

# nova narudžba
curl -X POST http://localhost:3000/narudzbe \
  -H "Content-Type: application/json" \
  -d '{"narucene_pizze":[{"naziv":"Margherita","velicina":"srednja","kolicina":2},{"naziv":"Fantasia","velicina":"jumbo","kolicina":1}],"podaci_dostava":{"prezime":"Perić","adresa":"Zagrebačka 15, Pula","telefon":"091234567"}}'

# neispravna narudžba – nema podataka za dostavu (400)
curl -X POST http://localhost:3000/narudzbe \
  -H "Content-Type: application/json" \
  -d '{"narucene_pizze":[{"naziv":"Margherita","velicina":"mala","kolicina":1}]}'

# sve narudžbe
curl http://localhost:3000/narudzbe
```

## Testiranje u Postmanu

Svi endpointovi, uključujući uspješne zahtjeve i slučajeve s greškom, nalaze se u
javnom Postman workspaceu, sa spremljenim primjerima odgovora:

**🔗 [Postman workspace – Pizza Express](https://www.postman.com/danielkatic1986-3952849/workspace/wa-pizza-express)**
