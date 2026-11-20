<template>
  <header class="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg shadow-orange-500/30">
          🍕
        </span>
        <div>
          <h1 class="text-xl font-extrabold tracking-tight text-white">
            Pizza <span class="text-orange-500">Express</span>
          </h1>
          <p class="text-xs text-slate-400">Topla pizza na tvoja vrata</p>
        </div>
      </RouterLink>

      <div class="flex items-center gap-3">
      <span class="hidden items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm text-orange-300 sm:inline-flex">
        <span class="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
        Dostava 30–45 min
      </span>

      <button
        @click="otvoriKosaricu"
        class="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-slate-800 text-xl transition-colors hover:bg-slate-700"
        aria-label="Otvori košaricu"
      >
        🛒
        <span
          v-if="brojKomada"
          class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white"
        >{{ brojKomada }}</span>
      </button>
    </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { brojKomada, kosaricaOtvorena } from '../kosarica.js';

const router = useRouter();

function otvoriKosaricu() {
  kosaricaOtvorena.value = true;
  router.push('/');
}
</script>