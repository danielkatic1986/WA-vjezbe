import { ref, reactive, computed } from 'vue';

export const stavke = ref([]);

export function dodajStavku(pizza, velicina, kolicina) {
  const postojeca = stavke.value.find((s) => s.naziv === pizza.naziv && s.velicina === velicina);

  if (postojeca) {
    postojeca.kolicina += kolicina;
  } else {
    stavke.value.push({
      naziv: pizza.naziv,
      velicina,
      kolicina,
      cijena: pizza.cijene[velicina], // cijena komada, samo za prikaz
    });
  }
}

export function ukloniStavku(index) {
  stavke.value.splice(index, 1);
}

export const ukupnoKosarice = computed(() =>
  stavke.value.reduce((zbroj, s) => zbroj + s.cijena * s.kolicina, 0),
);

export const brojKomada = computed(() =>
  stavke.value.reduce((zbroj, s) => zbroj + s.kolicina, 0),
);

export const kosaricaOtvorena = ref(false);

export const dostava = reactive({
  prezime: '',
  adresa: '',
  telefon: '',
});