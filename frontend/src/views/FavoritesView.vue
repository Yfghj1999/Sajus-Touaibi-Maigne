<script setup>
import { ref } from 'vue'

// test
const favorites = ref([
  { id: 1, title: 'Inception', type: 'movie', rating: 5, comment: 'Un film incroyable !' },
  { id: 2, title: 'Breaking Bad', type: 'tv', rating: null, comment: null },
])

function removeFavorite(id) {
  // preparation
  console.log('favori supprimé :', id)
}
</script>

<template>
  <h1>Mes favoris</h1>
  <ul>
  <li v-for="film in favorites" :key="film.id">
    {{ film.title }} ({{ film.type }}) 
    <span v-if="film.rating">{{ film.rating }}</span>
    <span v-if="film.comment">{{ film.comment }}</span>
    <button @click="removeFavorite(film.id)">Supprimer des favoris</button>
  </li>
</ul>
</template>
