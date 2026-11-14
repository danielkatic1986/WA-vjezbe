import express from 'express';
import { nekretnine, ponude } from '../data/podaci.js';

const router = express.Router();

// dohvati sve ponude
router.get('/', (req, res) => {
    res.status(200).json(ponude);
});

// pošalji novu ponudu
router.post('/', (req, res) => {
    const { id_nekretnine, ime_kupca, prezime_kupca, ponudena_cijena, telefon_kupca } = req.body || {};

    if (id_nekretnine === undefined || !ime_kupca || !prezime_kupca || ponudena_cijena === undefined || !telefon_kupca) {
        return res.status(400).json({ message: 'Niste poslali sve podatke o ponudi.' });
    }

    if (typeof id_nekretnine !== 'number') {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    if (typeof ponudena_cijena !== 'number' || ponudena_cijena <= 0) {
        return res.status(400).json({ message: 'Ponuđena cijena mora biti broj veći od 0.' });
    }

    const nekretnina = nekretnine.find(n => n.id === id_nekretnine);

    if (!nekretnina) {
        return res.status(404).json({ message: 'Nekretnina s tim ID-em ne postoji.' });
    }

    const novaPonuda = {
        id: ponude.length > 0 ? ponude[ponude.length - 1].id + 1 : 1,
        id_nekretnine,
        ime_kupca,
        prezime_kupca,
        ponudena_cijena,
        telefon_kupca
    };

    ponude.push(novaPonuda);
    res.status(201).json(novaPonuda);
});

export default router;
