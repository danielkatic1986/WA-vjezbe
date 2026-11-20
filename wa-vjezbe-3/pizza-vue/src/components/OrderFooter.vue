<template>
  <footer class="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto border-t border-white/10 bg-slate-900/90 shadow-2xl shadow-black backdrop-blur-lg">
    <div class="relative mx-auto max-w-6xl px-6 py-5">
      <button
        @click="emit('close')"
        class="absolute right-4 top-2 cursor-pointer text-2xl text-slate-400 hover:text-white"
        aria-label="Zatvori"
      >×</button>

      <!-- RED 1: [pizza + veličine] | [količina + ukupno + gumb] -->
      <div v-if="odabranaPizza" class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <!-- LIJEVA GRUPA: pizza + veličine -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <!-- odabrana pizza -->
          <div class="flex shrink-0 items-center gap-4">
            <img
              v-if="odabranaPizza.slika_url"
              :src="odabranaPizza.slika_url"
              :alt="odabranaPizza.naziv"
              class="h-16 w-16 rounded-xl object-cover shadow-md"
            />
            <div v-else class="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/20 text-3xl">🍕</div>
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-400">Odabrano</p>
              <h3 class="whitespace-nowrap text-xl font-bold text-orange-400">{{ odabranaPizza.naziv }}</h3>
            </div>
          </div>

          <!-- veličine -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(cijena, velicina) in odabranaPizza.cijene"
              :key="velicina"
              @click="odabranaVelicina = velicina"
              :class="[
                'cursor-pointer whitespace-nowrap rounded-xl border px-4 py-2 text-sm capitalize transition-all',
                odabranaVelicina === velicina
                  ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-orange-400',
              ]"
            >
              {{ velicina }} · {{ cijena.toFixed(2) }} €
            </button>
          </div>
        </div>

        <!-- DESNA GRUPA: količina + ukupno + gumb -->
        <div class="flex items-center justify-between gap-6 lg:justify-end">
          <!-- količina -->
          <div class="flex items-center gap-3">
            <button
              @click="smanjiKolicinu"
              :disabled="kolicina === 1"
              class="h-9 w-9 cursor-pointer rounded-full bg-slate-700 text-lg font-bold hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-700"
            >−</button>
            <span class="w-6 text-center text-lg font-semibold">{{ kolicina }}</span>
            <button
              @click="kolicina++"
              class="h-9 w-9 cursor-pointer rounded-full bg-slate-700 text-lg font-bold hover:bg-orange-500"
            >+</button>
          </div>

          <!-- ukupno za stavku -->
          <div class="text-right">
            <p class="text-xs uppercase tracking-widest text-slate-400">Ukupno</p>
            <p class="whitespace-nowrap text-2xl font-extrabold text-white">{{ ukupnaCijenaStavke }} €</p>
          </div>

          <!-- gumb -->
          <button
            @click="dodajUKosaricu"
            class="cursor-pointer whitespace-nowrap rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 active:scale-95"
          >
            Dodaj u košaricu
          </button>
        </div>
      </div>

      <!-- RED 2: košarica + dostava (samo ako ima stavki) -->
      <div v-if="stavke.length" :class="{ 'mt-5 border-t border-white/10 pt-4': odabranaPizza }">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- LIJEVO: stavke -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <h4 class="font-semibold text-white">Košarica</h4>
              <span class="text-sm text-slate-400">{{ brojKomada }} kom</span>
            </div>

            <ul class="max-h-56 space-y-2 overflow-y-auto pr-1">
              <li
                v-for="(stavka, index) in stavke"
                :key="stavka.naziv + stavka.velicina"
                class="flex items-center justify-between gap-3 rounded-xl bg-slate-800/70 px-4 py-2"
              >
                <span>
                  {{ stavka.naziv }}
                  <span class="capitalize text-slate-400">({{ stavka.velicina }})</span>
                  × {{ stavka.kolicina }}
                </span>
                <div class="flex items-center gap-3">
                  <span class="whitespace-nowrap font-semibold text-orange-400">
                    {{ (stavka.cijena * stavka.kolicina).toFixed(2) }} €
                  </span>
                  <button
                    @click="ukloniStavku(index)"
                    class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    :aria-label="`Ukloni ${stavka.naziv}`"
                    title="Ukloni iz košarice"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <!-- DESNO: obrazac za dostavu -->
          <form id="forma-dostava" @submit.prevent="posaljiNarudzbu" novalidate class="space-y-3">
            <h4 class="font-semibold text-white">Podaci za dostavu</h4>

            <!-- prezime -->
            <div>
              <label for="prezime" class="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">Prezime</label>
              <input
                id="prezime"
                v-model.trim="dostava.prezime"
                type="text"
                autocomplete="family-name"
                placeholder="npr. Horvat"
                :class="[
                  'w-full rounded-xl border bg-slate-800/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:ring-2',
                  greske.prezime ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-600 focus:border-orange-500 focus:ring-orange-500/30',
                ]"
              />
              <p v-if="greske.prezime" class="mt-1 text-xs text-red-400">{{ greske.prezime }}</p>
            </div>

            <!-- adresa -->
            <div>
              <label for="adresa" class="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">Adresa</label>
              <input
                id="adresa"
                v-model.trim="dostava.adresa"
                type="text"
                autocomplete="street-address"
                placeholder="npr. Zagrebačka 30, Pula"
                :class="[
                  'w-full rounded-xl border bg-slate-800/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:ring-2',
                  greske.adresa ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-600 focus:border-orange-500 focus:ring-orange-500/30',
                ]"
              />
              <p v-if="greske.adresa" class="mt-1 text-xs text-red-400">{{ greske.adresa }}</p>
            </div>

            <!-- telefon -->
            <div>
              <label for="telefon" class="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">Telefon</label>
              <input
                id="telefon"
                v-model.trim="dostava.telefon"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                placeholder="npr. 091 234 5678"
                :class="[
                  'w-full rounded-xl border bg-slate-800/70 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:ring-2',
                  greske.telefon ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-600 focus:border-orange-500 focus:ring-orange-500/30',
                ]"
              />
              <p v-if="greske.telefon" class="mt-1 text-xs text-red-400">{{ greske.telefon }}</p>
            </div>
          </form>
        </div>

        <!-- DNO: ukupno + naruči -->
        <div class="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">Za platiti</p>
            <p class="whitespace-nowrap text-2xl font-extrabold text-white">{{ ukupnoKosarice.toFixed(2) }} €</p>
          </div>
          <button
            type="submit"
            form="forma-dostava"
            :disabled="saljem"
            class="cursor-pointer whitespace-nowrap rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-500 active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-green-600"
          >
            {{ saljem ? 'Šaljem…' : 'Naruči' }}
          </button>
        </div>
      </div>

      <div v-else-if="!odabranaPizza" class="py-6 text-center text-slate-400">
        Košarica je prazna. Odaberi pizzu iz menija 🍕
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { stavke, dostava, dodajStavku, ukloniStavku, ukupnoKosarice, brojKomada } from '../kosarica.js'
import { prikaziObavijest } from '../obavijest.js'

const props = defineProps({
  odabranaPizza: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const odabranaVelicina = ref('mala')
const kolicina = ref(1)
const pokusanoSlanje = ref(false)
const saljem = ref(false)

const ukupnaCijenaStavke = computed(() =>
  (props.odabranaPizza.cijene[odabranaVelicina.value] * kolicina.value).toFixed(2),
)

const greske = computed(() => (pokusanoSlanje.value ? validirajDostavu(dostava) : {}))

function validirajDostavu(d) {
  const g = {}

  if (!/^[\p{L}\s'-]{2,}$/u.test(d.prezime)) {
    g.prezime = 'Unesi prezime (barem 2 slova).'
  }
  if (d.adresa.length < 5) {
    g.adresa = 'Unesi ulicu, kućni broj i grad.'
  }
  if (!/^\+?[0-9]{6,15}$/.test(d.telefon.replace(/[\s/-]/g, ''))) {
    g.telefon = 'Unesi ispravan broj telefona (npr. 091 234 5678).'
  }

  return g
}

function dodajUKosaricu() {
  dodajStavku(props.odabranaPizza, odabranaVelicina.value, kolicina.value)
  kolicina.value = 1
}

function smanjiKolicinu() {
  if (kolicina.value > 1) kolicina.value--
}

async function posaljiNarudzbu() {
  pokusanoSlanje.value = true

  if (Object.keys(validirajDostavu(dostava)).length > 0) return

  saljem.value = true

  try {
    const odgovor = await axios.post('http://localhost:3000/narudzbe', {
      narucene_pizze: stavke.value.map((s) => ({
        naziv: s.naziv,
        velicina: s.velicina,
        kolicina: s.kolicina,
      })),
      podaci_dostava: { ...dostava },
    })

    // poruka i ukupna cijena dolaze s poslužitelja
    prikaziObavijest('uspjeh', odgovor.data.message, `Ukupno za platiti: ${odgovor.data.ukupno} €`)

    // reset košarice i obrasca
    stavke.value = []
    dostava.prezime = ''
    dostava.adresa = ''
    dostava.telefon = ''
    pokusanoSlanje.value = false

    emit('close') 
  } catch (error) {
    prikaziObavijest(
      'greska',
      error.response?.data?.message ?? 'Poslužitelj nije dostupan. Provjeri vezu i pokušaj ponovno.',
    )
  } finally {
    saljem.value = false
  }
}

// kad korisnik klikne drugu pizzu, vrati izbor na početne vrijednosti
watch(
  () => props.odabranaPizza,
  () => {
    odabranaVelicina.value = 'mala'
    kolicina.value = 1
  },
)
</script>