<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-4 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="-translate-y-4 opacity-0"
  >
    <div
      v-if="obavijest"
      class="pointer-events-none fixed inset-x-0 top-24 z-60 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        :class="[
          'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border p-4 shadow-2xl shadow-black/50 backdrop-blur-lg',
          obavijest.tip === 'uspjeh' ? 'border-green-500/40 bg-green-950/90' : 'border-red-500/40 bg-red-950/90',
        ]"
      >
        <span class="text-2xl">{{ obavijest.tip === 'uspjeh' ? '✅' : '⚠️' }}</span>

        <div class="flex-1">
          <p class="font-semibold text-white">{{ obavijest.poruka }}</p>
          <p v-if="obavijest.detalji" class="mt-0.5 text-sm text-slate-300">{{ obavijest.detalji }}</p>
        </div>

        <button
          @click="zatvoriObavijest"
          class="cursor-pointer text-xl leading-none text-slate-400 hover:text-white"
          aria-label="Zatvori obavijest"
        >×</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { obavijest, zatvoriObavijest } from '../obavijest.js'
</script>