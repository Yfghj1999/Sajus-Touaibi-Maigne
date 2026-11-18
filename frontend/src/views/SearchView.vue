<script setup>
import { ref } from 'vue'

const query = ref('')

// test
const allFilms = [
  { id: 1, title: 'Inception', type: 'movie', year: 2010 },
  { id: 2, title: 'Breaking Bad', type: 'tv', year: 2008 },
  { id: 3, title: 'Interstellar', type: 'movie', year: 2014 },
]

const results = ref([])
const searched = ref(false)

function search() {
  
  results.value = allFilms.filter(film => film.title.toLowerCase().includes(query.value.toLowerCase()))
  searched.value = true
}

function addFavorite(film) {
  // préparation
  console.log('favori ajouté :', film.title)
}

</script>

<template>
  <h1>Recherche</h1>
  <form @submit.prevent="search">
    <input v-model="query" placeholder="Titre d'un film ou d'une série" />
    <button type="submit">Rechercher</button>
  </form>
  <ul>
  <li v-for="film in results" :key="film.id">
    {{ film.title }} ({{ film.type }}, {{ film.year }})
    <button @click="addFavorite(film)">Ajouter aux favoris</button>
  </li>
</ul>
<p v-if="searched && results.length === 0">Aucun résultat</p>


</template>
