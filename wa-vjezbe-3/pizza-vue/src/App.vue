<template>
  <div class="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
    <div class="pointer-events-none absolute -top-40 left-1/2 h-96 w-3xl -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl"></div>

    <Header />

    <main class="relative mx-auto max-w-6xl px-6 py-10">
      <RouterView />
    </main>

    <Obavijest />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Obavijest from './components/Obavijest.vue'
</script>