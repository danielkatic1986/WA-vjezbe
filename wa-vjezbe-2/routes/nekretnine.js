import express from 'express';
import { nekretnine } from '../data/podaci.js';

const router = express.Router();

// provjera podataka nekretnine, vraća poruku greške ili null
function provjeriNekretninu(n) {
    if (n.cijena !== undefined && (typeof n.cijena !== 'number' || n.cijena < 0)) {
        return 'Cijena mora biti broj i ne smije biti negativna.';
    }
    if (n.broj_soba !== undefined && (!Number.isInteger(n.broj_soba) || n.broj_soba < 0)) {
        return 'Broj soba mora biti cijeli broj i ne smije biti negativan.';
    }
    if (n.povrsina !== undefined && (typeof n.povrsina !== 'number' || n.povrsina <= 0)) {
        return 'Površina mora biti broj veći od 0.';
    }
    return null;
}

// dohvati sve nekretnine
router.get('/', (req, res) => {
    res.status(200).json(nekretnine);
});

// dohvati nekretninu po ID-u
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    const nekretnina = nekretnine.find(n => n.id === id);

    if (!nekretnina) {
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    res.status(200).json(nekretnina);
});

// dodaj novu nekretninu
router.post('/', (req, res) => {
    const { naziv, opis, cijena, lokacija, broj_soba, povrsina } = req.body || {};

    if (!naziv || !opis || cijena === undefined || !lokacija || broj_soba === undefined || povrsina === undefined) {
        return res.status(400).json({ message: 'Niste poslali sve podatke o nekretnini.' });
    }

    const greska = provjeriNekretninu(req.body);
    if (greska) {
        return res.status(400).json({ message: greska });
    }

    const novaNekretnina = {
        id: nekretnine.length > 0 ? nekretnine[nekretnine.length - 1].id + 1 : 1,
        naziv,
        opis,
        cijena,
        lokacija,
        broj_soba,
        povrsina
    };

    nekretnine.push(novaNekretnina);
    res.status(201).json(novaNekretnina);
});

// ažuriraj nekretninu potpuno
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    const index = nekretnine.findIndex(n => n.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    const { naziv, opis, cijena, lokacija, broj_soba, povrsina } = req.body || {};

    if (!naziv || !opis || cijena === undefined || !lokacija || broj_soba === undefined || povrsina === undefined) {
        return res.status(400).json({ message: 'Za potpuno ažuriranje morate poslati sve podatke.' });
    }

    const greska = provjeriNekretninu(req.body);
    if (greska) {
        return res.status(400).json({ message: greska });
    }

    nekretnine[index] = { id, naziv, opis, cijena, lokacija, broj_soba, povrsina };
    res.status(200).json(nekretnine[index]);
});

// ažuriraj nekretninu djelomično
router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    const nekretnina = nekretnine.find(n => n.id === id);

    if (!nekretnina) {
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Niste poslali podatke za ažuriranje.' });
    }

    const greska = provjeriNekretninu(req.body);
    if (greska) {
        return res.status(400).json({ message: greska });
    }

    const { naziv, opis, cijena, lokacija, broj_soba, povrsina } = req.body;

    if (naziv !== undefined) nekretnina.naziv = naziv;
    if (opis !== undefined) nekretnina.opis = opis;
    if (cijena !== undefined) nekretnina.cijena = cijena;
    if (lokacija !== undefined) nekretnina.lokacija = lokacija;
    if (broj_soba !== undefined) nekretnina.broj_soba = broj_soba;
    if (povrsina !== undefined) nekretnina.povrsina = povrsina;

    res.status(200).json(nekretnina);
});

// obriši nekretninu
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    const index = nekretnine.findIndex(n => n.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    nekretnine.splice(index, 1);
    res.status(200).json({ message: 'Nekretnina je obrisana.' });
});

export default router;
