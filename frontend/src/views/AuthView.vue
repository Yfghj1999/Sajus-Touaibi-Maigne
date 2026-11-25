<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  error.value = ''                         
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe obligatoires'
    return
  }
  // préparation
  console.log('login', email.value, password.value)
}
const registerEmail = ref('')
const registerPassword = ref('')
const registerError = ref('')

function register() {
  registerError.value = ''
  if (!registerEmail.value || !registerPassword.value) {
    registerError.value = 'Email et mot de passe obligatoires'
    return
  }
  if (registerPassword.value.length < 8) {
    registerError.value = 'Le mot de passe doit faire au moins 8 caractères'
    return
  }
  // preparation
  console.log('register', registerEmail.value)
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
  <form @submit.prevent="register">
    <input v-model="registerEmail" type="email" placeholder="Email" />
    <input v-model="registerPassword" type="password" placeholder="Mot de passe" />
    <button type="submit">S'inscrire</button>
  </form>
  <p v-if="registerError" class="error">{{ registerError }}</p>

</template>

<style scoped>
.error { color: red; }
</style>
