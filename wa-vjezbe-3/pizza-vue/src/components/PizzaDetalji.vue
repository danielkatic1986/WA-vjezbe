<template>
  <section>
    <!-- natrag na popis -->
    <RouterLink
      :to="{ name: 'pizze' }"
      class="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-orange-500/50 hover:text-white"
    >
      ← Natrag na popis
    </RouterLink>

    <!-- 1) učitavanje -->
    <div v-if="ucitavanje" class="grid gap-8 md:grid-cols-2">
      <div class="aspect-square animate-pulse rounded-3xl bg-slate-800/60"></div>
      <div class="space-y-4">
        <div class="h-12 w-2/3 animate-pulse rounded-xl bg-slate-800/60"></div>
        <div class="h-8 w-full animate-pulse rounded-xl bg-slate-800/60"></div>
        <div class="h-24 w-full animate-pulse rounded-xl bg-slate-800/60"></div>
      </div>
    </div>

    <!-- 2) greška (npr. pizza ne postoji → poruka s poslužitelja) -->
    <div v-else-if="greska" class="rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
      <p class="text-6xl">🍕</p>
      <p class="mt-4 text-lg font-semibold text-red-300">{{ greska }}</p>
    </div>

    <!-- 3) detalji pizze -->
    <article v-else class="grid gap-8 md:grid-cols-2 md:items-start">
      <!-- slika -->
      <div class="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-orange-500/30 to-red-600/20 shadow-2xl shadow-black/40">
        <img v-if="pizza.slika_url" :src="pizza.slika_url" :alt="pizza.naziv" class="aspect-square w-full object-cover" />
        <div v-else class="flex aspect-square items-center justify-center text-9xl">🍕</div>
      </div>

      <!-- podaci -->
      <div>
        <p class="text-sm font-semibold uppercase tracking-widest text-orange-400">Pizza</p>
        <h2 class="mt-1 text-5xl font-extrabold tracking-tight">{{ pizza.naziv }}</h2>

        <h3 class="mt-8 text-sm font-semibold uppercase tracking-wider text-slate-400">Sastojci</h3>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li
            v-for="sastojak in pizza.sastojci"
            :key="sastojak"
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200"
          >
            <v-icon v-if="ikoneSastojaka[sastojak]" :name="ikoneSastojaka[sastojak]" class="text-orange-400" />
            {{ sastojak }}
          </li>
        </ul>

        <h3 class="mt-8 text-sm font-semibold uppercase tracking-wider text-slate-400">Odaberi veličinu</h3>
        <div class="mt-3 grid grid-cols-3 gap-3">
          <button
            v-for="(cijena, velicina) in pizza.cijene"
            :key="velicina"
            @click="odabranaVelicina = velicina"
            :class="[
              'cursor-pointer rounded-2xl border p-4 text-center transition-all',
              odabranaVelicina === velicina
                ? 'border-orange-500 bg-orange-500/15 ring-2 ring-orange-500/40'
                : 'border-white/10 bg-slate-900/80 hover:border-orange-500/40',
            ]"
          >
            <p class="text-sm capitalize text-slate-400">{{ velicina }}</p>
            <p class="mt-1 text-xl font-bold text-white">{{ cijena.toFixed(2) }} €</p>
          </button>
        </div>

        <button
          @click="dodajUKosaricu"
          class="mt-8 w-full cursor-pointer rounded-2xl bg-orange-500 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 active:scale-[0.98]"
        >
          Dodaj u košaricu · {{ pizza.cijene[odabranaVelicina].toFixed(2) }} €
        </button>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ikoneSastojaka } from '../ikone.js'
import { dodajStavku } from '../kosarica.js'
import { prikaziObavijest } from '../obavijest.js'

const route = useRoute() // podaci o trenutnom URL-u, npr. route.params.naziv

const pizza = ref(null)
const ucitavanje = ref(true)
const greska = ref(null)
const odabranaVelicina = ref(null)

function dodajUKosaricu() {
  dodajStavku(pizza.value, odabranaVelicina.value, 1)
  prikaziObavijest('uspjeh', 'Dodano u košaricu', `${pizza.value.naziv} (${odabranaVelicina.value})`)
}

onMounted(async () => {
  try {
    const naziv = encodeURIComponent(route.params.naziv) // "Al Tonno" → "Al%20Tonno"
    const odgovor = await axios.get(`http://localhost:3000/pizze/${naziv}`)

    pizza.value = odgovor.data
    odabranaVelicina.value = Object.keys(odgovor.data.cijene)[0] // prva dostupna veličina
  } catch (error) {
    greska.value = error.response?.data?.message ?? 'Poslužitelj trenutno nije dostupan. Pokušaj ponovno kasnije.'
  } finally {
    ucitavanje.value = false
  }
})
</script>