<template>
  <v-container fluid class="d-flex justify-center pa-2">
    <div class="app-content">
    <v-row>
      <v-col cols="12">
        <div class="text-center mb-6">
          <h1 class="font-weight-bold text-primary mb-3">
            <v-icon class="me-3" size="large">mdi-check-circle-multiple</v-icon>
            Умный список задач
          </h1>
        </div>
        
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3">
            <v-card color="primary" variant="flat" elevation="12">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ totalTasks }}</div>
                <div class="text-caption">Всего задач</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="orange" variant="flat" elevation="12">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ todoTasks }}</div>
                <div class="text-caption">К выполнению</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="grey" variant="flat" elevation="12">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ inProgressTasks }}</div>
                <div class="text-caption">В работе</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="green" variant="flat" elevation="12">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ completedTasks }}</div>
                <div class="text-caption">Выполнено</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <TodoFilters
          :filters="filters"
          @update:filters="handleFiltersUpdate"
        />
        
        <TodoTable
          :tasks="filteredTasks"
          :total-tasks="totalTasks"
        />
      </v-col>
    </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../store/todoStore'
import TodoTable from '../components/TodoTable.vue'
import TodoFilters from '../components/TodoFilters.vue'
import type { TaskFilters } from '../types'

const todoStore = useTodoStore()

const filteredTasks = computed(() => todoStore.filteredTasks)
const totalTasks = computed(() => todoStore.totalTasks)
const completedTasks = computed(() => todoStore.completedTasks)
const inProgressTasks = computed(() => todoStore.inProgressTasks)
const todoTasks = computed(() => todoStore.todoTasks)
const filters = computed(() => todoStore.filters)

const handleFiltersUpdate = (newFilters: TaskFilters) => {
  todoStore.setFilters(newFilters)
}
</script>

<style scoped>
.app-content {
  width: 100%;
  max-width: 80%;
  min-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 30px 0;
}
</style>