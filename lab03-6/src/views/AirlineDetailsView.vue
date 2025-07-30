<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAirlineById } from '@/../service/PassengerService'
import CountryFlag from 'vue-country-flag-next'

interface AirlineDetails {
  id: number;
  name: string;
  country: string;
}

// Map country names to ISO 3166-1 alpha-2 codes
const countryCodeMap: Record<string, string> = {
  'USA': 'US',
  'UK': 'GB',
  'Canada': 'CA',
  'France': 'FR',
  'Germany': 'DE',
  'Australia': 'AU',
  'Japan': 'JP',
  'Italy': 'IT',
  'Spain': 'ES',
  'Brazil': 'BR',
  'Thailand': 'TH',
  'Sweden': 'SE',
  'Russia': 'RU',
  'South Africa': 'ZA',
  'India': 'IN'
}

const route = useRoute()
const airline = ref<AirlineDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

function getCountryCode(country: string): string {
  return countryCodeMap[country] || ''
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getAirlineById(String(route.params.airlineId))
    airline.value = res.data
  } catch (e: any) {
    router.replace({ name: 'not-found' })
    if (!window.navigator.onLine || (e && e.message && e.message.toLowerCase().includes('network'))) {
      router.replace({ name: 'resource-not-found' })
      return
    }
    return
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div>
    <h1>Airline Details</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="airline">
      <p><strong>ID:</strong> {{ airline?.id }}</p>
      <p><strong>Name:</strong> {{ airline?.name }}</p>
      <p>
        <strong>Country:</strong> {{ airline?.country }}
        <CountryFlag
          v-if="getCountryCode(airline.country)"
          :country="getCountryCode(airline.country)"
          style="font-size: 2rem; margin-left: 0.5rem;"
        />
      </p>
    </div>
  </div>
</template>