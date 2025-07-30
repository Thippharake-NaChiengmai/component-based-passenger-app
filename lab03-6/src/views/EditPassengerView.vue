<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPassengerDetailsById } from '@/../service/PassengerService'
import { stateMessage, setStateMessage, clearStateMessage } from '@/stores/message'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const passenger = ref<any>(null)

onMounted(async () => {
  loading.value = true
  clearStateMessage()
  try {
    const res = await getPassengerDetailsById(String(route.params.id))
    passenger.value = res.data
  } catch (e: any) {
    error.value = e.message || 'Unknown error'
  } finally {
    loading.value = false
  }
})

function updatePassenger() {
  // Implement update logic here (API call)
  setStateMessage('Passenger details updated!')
  // Optionally, navigate after a delay
  setTimeout(() => {
    router.push({ name: 'passenger-details', params: { id: route.params.id } })
  }, 1500)
}
</script>

<template>
  <div>
    <h1>Edit Passenger Details</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="passenger">
      <form @submit.prevent="updatePassenger">
        <label>
          Name:
          <input v-model="passenger.name" />
        </label>
        <br />
        <label>
          Age:
          <input type="number" v-model="passenger.age" />
        </label>
        <br />
        <label>
          Description:
          <input v-model="passenger.description" />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
      <div v-if="stateMessage" class="state-message">{{ stateMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
.state-message {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #e0ffe0;
  color: #007700;
  border-radius: 8px;
  font-weight: bold;
}
</style>