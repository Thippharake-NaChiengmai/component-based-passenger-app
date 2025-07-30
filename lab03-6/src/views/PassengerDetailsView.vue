<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPassengerDetailsById } from '@/../service/PassengerService'

interface PassengerDetails {
  id: number;
  name: string;
  age: number;
  trips: number;
  description: string;
  latitude: number;
  longitude: number;
}

const route = useRoute()
const router = useRouter()
const passenger = ref<PassengerDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getPassengerDetailsById(String(route.params.id))
    // Map arrivalAirport.latitude/longitude to top-level
    const data = res.data
    passenger.value = {
      ...data,
      latitude: data.arrivalAirport?.latitude ?? null,
      longitude: data.arrivalAirport?.longitude ?? null,
    }
  } catch (e: any) {
    if (!window.navigator.onLine || (e && e.message && e.message.toLowerCase().includes('network'))) {
      router.replace({ name: 'resource-not-found' })
      return
    }
    router.replace({ name: 'not-found' })
  } finally {
    loading.value = false
  }
})

const locationError = computed(() =>
  passenger.value &&
  (passenger.value.latitude === null || passenger.value.latitude === undefined ||
   passenger.value.longitude === null || passenger.value.longitude === undefined)
    ? 'Location data is not available for this passenger.'
    : null
)
</script>
<template>
  <div>
    <h1>Passenger Details</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="passenger">
      <p><strong>ID:</strong> {{ passenger?.id }}</p>
      <p><strong>Name:</strong> {{ passenger?.name }}</p>
      <p><strong>Age:</strong> {{ passenger?.age }}</p>
      <p><strong>Trips:</strong> {{ passenger?.trips }}</p>
      <p><strong>Description:</strong> {{ passenger?.description }}</p>
      <div v-if="locationError">
        <span style="color:red;">{{ locationError }}</span>
      </div>
      <div v-else-if="passenger.latitude && passenger.longitude" style="margin-top:1rem;">
        <h3>Arrival Location</h3>
        <iframe
          :src="`https://maps.google.com/maps?q=${passenger.latitude},${passenger.longitude}&z=15&output=embed`"
          width="100%"
          height="300"
          style="border:0;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <button @click="router.push({ name: 'edit-passenger', params: { id: passenger.id } })">
        Edit
      </button>
      <router-view />
    </div>
  </div>
</template>