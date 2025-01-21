<template>
  <div
    class="container flex min-h-[100dvh] w-screen select-none flex-col items-center justify-center"
  >
    <div class="mx-5 flex flex-col gap-3">
      <h1 class="text-center font-space_grotesk text-2xl font-semibold">Selamat Datang!</h1>
      <input
        type="text"
        name="idujian"
        id="ujian-input"
        class="w-full min-w-72 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 active:outline-none md:h-12 md:min-w-96"
        placeholder="Masukkan ID Ujian"
        v-model="idUjian"
      />
    </div>
    <div class="mt-4 w-72 rounded-md border border-gray-300 p-4 md:w-96">
      <h3 class="font-space_grotesk font-semibold text-gray-600">Status</h3>

      <!-- Loading state for Info -->
      <p v-if="isInfoLoading" class="text-sm text-gray-500">Memuat informasi ujian...</p>
      <p v-else :class="`text-sm ${isInfoAvailable ? 'text-blue-500' : 'text-red-500'}`">
        {{ isInfoAvailable ? 'Informasi ujian tersedia' : 'Informasi ujian tidak tersedia' }}
      </p>

      <!-- Loading state for Content -->
      <p v-if="isContentLoading" class="text-sm text-gray-500">Memuat konten ujian...</p>
      <p v-else :class="`text-sm ${isContentAvailable ? 'text-blue-500' : 'text-red-500'}`">
        {{ isContentAvailable ? 'Konten ujian tersedia' : 'Konten ujian tidak tersedia' }}
      </p>
    </div>
    <div class="mt-4 w-72 rounded-md border border-gray-300 p-4 md:w-96" v-if="soalMeta?.idUjian">
      <h3 class="font-space_grotesk font-semibold text-gray-600">Informasi Ujian</h3>
      <p v-if="soalMeta" class="text-sm text-gray-500">
        <span class="font-semibold">Nama Bab:</span> {{ soalMeta.namaBab }}
      </p>
      <p v-if="soalMeta" class="text-sm text-gray-500">
        <span class="font-semibold">Mata Pelajaran:</span> {{ soalMeta.namaMapel }}
      </p>
      <p v-if="soalMeta" class="text-sm text-gray-500">
        <span class="font-semibold">Kelas:</span> {{ soalMeta.namaKelas }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const idUjian = ref<string>('')
const isInfoAvailable = ref<boolean>(false)
const isContentAvailable = ref<boolean>(false)
const isInfoLoading = ref<boolean>(false)
const isContentLoading = ref<boolean>(false)

const soalMeta = ref<Meta | undefined>()
const soalData = ref<SoalResponse | undefined>()
const soalId = computed<string | undefined>(() => soalMeta.value?.idUjian)

const level = computed<Level>(() => {
  if (!soalMeta.value) return 'fallback'

  const kelas = soalMeta.value?.namaKelas

  return kelas.includes('SD') ? 'sd' : kelas.includes('SMP') ? 'smp' : 'sma'
})

watch(idUjian, async (id) => {
  if (id.length === 0) {
    isInfoAvailable.value = false
    isContentAvailable.value = false
    return
  }

  isInfoLoading.value = true
  isContentLoading.value = true

  soalMeta.value = await fetchSoalMeta(id)
  isInfoAvailable.value = !!soalMeta.value.idUjian
  isInfoLoading.value = false

  if (soalMeta.value.idUjian) {
    soalData.value = await fetchSoalData(soalId.value as string, level.value)
    isContentAvailable.value = !!soalData.value.data
    isContentLoading.value = false
  } else {
    isContentAvailable.value = false
    isContentLoading.value = false
  }
})
</script>

<style></style>
