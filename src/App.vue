<template>
  <v-app class="app-background">
    <v-app-bar
      color="primary"
      dark
      elevation="2"
      height="64"
      fixed
    >
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="me-2">mdi-check-circle-multiple</v-icon>
        Умный список задач
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        icon="mdi-github"
        variant="text"
        href="https://github.com/Fipoka2/vue3-todo-app"
        target="_blank"
      />
    </v-app-bar>
    
    <v-main>
      <router-view />
    </v-main>
    
  </v-app>
</template>

<script setup lang="ts">
</script>