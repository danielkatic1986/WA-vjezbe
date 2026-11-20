import express from 'express';
import { pizze } from '../data/data.js';

const router = express.Router();

export function pizzaDostupna(pizza) {
    const pronadenaPizza = pizze.find((p) => p.naziv.toLowerCase() === pizza);

    return pronadenaPizza;
}

router.get('/', (req, res) => {
    if(!pizze || pizze.length === 0) {
        return res.status(404).json({
            message: 'Nema dostupnih pizza.'
        });
    }
    res.status(200).json(pizze);
});

router.get('/:naziv', (req, res) => {
    const naziv = req.params.naziv.toLowerCase();
    let pizza = pizzaDostupna(naziv);

    if(!pizza) {
        return res.status(404).json({
            message: `Pizza naziva '${naziv}' ne postoji.`
        });
    }

    res.status(200).json(pizza);
});

export default router;