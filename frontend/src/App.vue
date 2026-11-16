<script setup></script>

<template>
  <nav>
    <RouterLink to="/">Accueil</RouterLink> |
    <RouterLink to="/search">Recherche</RouterLink> |
    <RouterLink to="/favorites">Favoris</RouterLink> |
    <RouterLink to="/auth">Connexion</RouterLink>
  </nav>
  <RouterView />
</template>


<style scoped></style>
