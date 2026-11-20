import { ref } from 'vue'

export const obavijest = ref(null) 

let timer = null

export function prikaziObavijest(tip, poruka, detalji = null) {
  obavijest.value = { tip, poruka, detalji }

  clearTimeout(timer)
  timer = setTimeout(zatvoriObavijest, 5000)
}

export function zatvoriObavijest() {
  obavijest.value = null
}