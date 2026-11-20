import express from 'express';
import { narudzbe, pizze } from '../data/data.js';

const router = express.Router();

let narudzbaID = narudzbe.length;

/*
Primjer narudžbe:
{
  "narucene_pizze": [
    { "naziv": "Margherita", "velicina": "srednja", "kolicina": 2 }
  ],
  "podaci_dostava": { "prezime": "Perić", "adresa": "Zagrebačka 15, Pula", "telefon": "091234567" }
}
*/

function validacijaPizzi(nar_pizze) {
    if (!Array.isArray(nar_pizze) || nar_pizze.length === 0) {
        return { validirano: false, status: ['nema-pizza'], neispravnePizze: [], ukupno: 0 };
    }
    
    const obaveznaPolja = ['naziv', 'velicina', 'kolicina'];
    let odgovor = { validirano: true, status : [], neispravnePizze : [], ukupno: 0};

    for(const pizza of nar_pizze) {
        if (typeof pizza !== 'object' || pizza === null || Array.isArray(pizza)) {
            odgovor.status.push('neispravna-polja');
            odgovor.validirano = false;
            return odgovor;
        }

        const imaSvaObaveznaPolja = obaveznaPolja.every((polje) => Object.hasOwn(pizza, polje));
        const nemaViska = Object.keys(pizza).every((kljuc) => obaveznaPolja.includes(kljuc));
        const ispravno = imaSvaObaveznaPolja && nemaViska;
        
        if(!ispravno) {
            odgovor.status.push('neispravna-polja');
            odgovor.validirano = false;
            return odgovor;
        }
        
        const pizzaPostoji = pizze.find((p) => p.naziv.toLowerCase() === pizza.naziv.toLowerCase());
        if(!pizzaPostoji) { 
            odgovor.neispravnePizze.push(pizza.naziv);
            odgovor.status.push('neispravan-naziv');
            odgovor.validirano = false;
        }

        if (!pizzaPostoji?.cijene[pizza.velicina]) {
            odgovor.neispravnePizze.push(pizza.naziv);
            odgovor.status.push('neispravna-velicina');
            odgovor.validirano = false;
        }

        if(!Number.isInteger(pizza.kolicina)) {
            odgovor.neispravnePizze.push(pizza.naziv);
            odgovor.status.push('kolicina-nije-broj');
            odgovor.validirano = false;
        }

        if(pizza.kolicina <= 0) {
            odgovor.neispravnePizze.push(pizza.naziv);
            odgovor.status.push('kolicina-manja-ili-jednaka-nuli');
            odgovor.validirano = false;
        }

        odgovor.ukupno += pizza?.kolicina * pizzaPostoji?.cijene[pizza.velicina];
    }

    return odgovor;
}

function validacijaDostave(podaci) {
    if (typeof podaci !== 'object' || podaci === null || Array.isArray(podaci)) return false;

    const obaveznaPolja = ['prezime', 'adresa', 'telefon'];
    const imaSvaObaveznaPolja = obaveznaPolja.every((polje) => Object.hasOwn(podaci, polje));
    const nemaViska = Object.keys(podaci).every((kljuc) => obaveznaPolja.includes(kljuc));
    const nemaPraznih = obaveznaPolja.every(
        (polje) => typeof podaci[polje] === 'string' && podaci[polje].trim() !== ''
    );

    return imaSvaObaveznaPolja && nemaViska && nemaPraznih;
}

router.post('/', (req, res) => {
    const { narucene_pizze, podaci_dostava } = req.body;

    if(!narucene_pizze || narucene_pizze.length === 0) {
        return res.status(400).json({
            message: 'U narudžbi nema pizze.'
        });
    }

    const ispravnePizze = validacijaPizzi(narucene_pizze);

    if(!ispravnePizze.validirano) return res.status(400).json({
        message: 'Neispravna validacija pizzi.',
        validacija: ispravnePizze
    });

    const ispravnaDostava = validacijaDostave(podaci_dostava);

    if(!ispravnaDostava) {
        return res.status(400).json({
            message: 'Molimo unesite prezime, adresu i broj telefona za dostavu.'
        });
    }

    narudzbe.push({
        id: ++narudzbaID,
        pizze: narucene_pizze,
        dostava: podaci_dostava,
        ukupno: ispravnePizze.ukupno.toFixed(2)
    });

    res.status(201).json({
        message: 'Narudžba zaprimljena.',
        narudzba: {narucene_pizze, podaci_dostava},
        ukupno: ispravnePizze.ukupno.toFixed(2)
    });
});

router.get('/', (req, res) => {
    if(!narudzbe || narudzbe.length === 0) {
        return res.status(200).json({
            message: 'Trenutno nema narudžbi.'
        });
    }

    res.status(200).json(narudzbe);
});

export default router;
