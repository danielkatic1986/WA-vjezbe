<template>
  <section :class="{ 'pb-96': odabrana_pizza || kosaricaOtvorena }">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-widest text-orange-400">Jelovnik</p>
      <h2 class="mt-1 text-4xl font-extrabold tracking-tight">Naš meni</h2>
      <p class="mt-2 text-slate-400">Odaberi pizzu, veličinu i količinu.</p>
    </div>

    <div v-if="ucitavanje" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="h-80 animate-pulse rounded-2xl bg-slate-800/60"></div>
    </div>

    <div v-else-if="greska" class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
      {{ greska }}
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="pizza in pizze"
        :key="pizza.id"
        @click="odaberiPizzu(pizza)"
        :class="[
            'group cursor-pointer overflow-hidden rounded-2xl border bg-slate-900/80 shadow-xl shadow-black/30 transition-all duration-300',
            odabrana_pizza?.id === pizza.id
            ? '-translate-y-1 border-orange-500 ring-4 ring-orange-500/30'
            : 'border-white/10 hover:-translate-y-1 hover:border-orange-500/40',
        ]"
      >
        <div class="h-44 overflow-hidden bg-linear-to-br from-orange-500/30 to-red-600/20">
          <img
            v-if="pizza.slika_url"
            :src="pizza.slika_url"
            :alt="pizza.naziv"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="flex h-full items-center justify-center text-7xl">🍕</div>
        </div>

        <div class="p-5">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-xl font-bold text-orange-400">{{ pizza.naziv }}</h3>
            <RouterLink
              :to="{ name: 'pizza-detalji', params: { naziv: pizza.naziv } }"
              @click.stop
              class="whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium text-slate-400 transition-colors hover:bg-orange-500/10 hover:text-orange-400"
            >
              Detalji →
            </RouterLink>
          </div>

          <div class="mt-3 flex flex-wrap gap-1.5">
            <span
                v-for="sastojak in pizza.sastojci"
                :key="sastojak"
                class="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
            >
                <v-icon v-if="ikoneSastojaka[sastojak]" :name="ikoneSastojaka[sastojak]" scale="0.8" class="text-orange-400" />
                {{ sastojak }}
            </span>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              :key="velicina"
              class="rounded-xl bg-slate-800/70 py-2 text-center"
            >
              <p class="text-xs capitalize text-slate-400">{{ velicina }}</p>
              <p class="font-semibold text-white">{{ cijena.toFixed(2) }} €</p>
            </div>
          </div>
        </div>
      </article>
    </div>

    <OrderFooter
        v-if="odabrana_pizza || kosaricaOtvorena"
        :odabrana-pizza="odabrana_pizza"
        @close="zatvoriFooter"
        />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ikoneSastojaka } from '../ikone.js'
import { kosaricaOtvorena } from '../kosarica.js'
import OrderFooter from './OrderFooter.vue'

const pizze = ref([])
const ucitavanje = ref(true)
const greska = ref(null)
const odabrana_pizza = ref(null)

function odaberiPizzu(pizza) {
  odabrana_pizza.value = pizza
}

function zatvoriFooter() {
  odabrana_pizza.value = null
  kosaricaOtvorena.value = false
}

function naTipku(event) {
  if (event.key === 'Escape') zatvoriFooter()
}

onMounted(() => window.addEventListener('keydown', naTipku))

onUnmounted(() => {
  window.removeEventListener('keydown', naTipku)
  kosaricaOtvorena.value = false
})

onMounted(async () => {
  try {
    const odgovor = await axios.get('http://localhost:3000/pizze')
    pizze.value = odgovor.data
  } catch (error) {
    greska.value = error.response?.data?.message ?? 'Poslužitelj trenutno nije dostupan. Pokušaj ponovno kasnije.'
  } finally {
    ucitavanje.value = false
  }
})
</script>