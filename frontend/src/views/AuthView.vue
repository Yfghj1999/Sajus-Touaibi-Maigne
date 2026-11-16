<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  error.value = ''                         // on efface l'ancienne erreur
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe obligatoires'
    return
  }
  // plus tard (9.3) : appel à POST /auth/login du backend
  console.log('login', email.value, password.value)
}
</script>

<template>
  <h1>Connexion</h1>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">Se connecter</button>
  </form>
  <p v-if="error" class="error">{{ error }}</p>

  <h1>Inscription</h1>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">S'inscrire</button>
  </form>
  <p v-if="error" class="error">{{ error }}</p>
</template>

<style scoped>
.error { color: red; }
</style>
