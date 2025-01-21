<template>
  <div
    class="container w-screen min-h-[100dvh] flex flex-col justify-center items-center select-none"
  >
    <div class="flex flex-col gap-3 mx-5">
      <h1 class="text-2xl font-semibold font-space_grotesk text-center">Selamat Datang!</h1>
      <input
        type="text"
        name="idujian"
        id="ujian-input"
        class="w-full p-2 border border-gray-300 rounded-md min-w-72 md:min-w-96 md:h-12 active:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Masukkan ID Ujian"
        v-model="idUjian"
      />
    </div>
    <div class="border border-gray-300 mt-4 rounded-md p-4 w-72 md:w-96">
      <h3 class="font-semibold text-gray-600 font-space_grotesk">Status</h3>

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
    <div class="border border-gray-300 mt-4 rounded-md p-4 w-72 md:w-96" v-if="soalMeta?.idUjian">
      <h3 class="font-semibold text-gray-600 font-space_grotesk">Informasi Ujian</h3>
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

const soalMeta: Ref<Meta | undefined> = ref()
const soalData: Ref<SoalResponse | undefined> = ref()
const soalId: ComputedRef<string | undefined> = computed(() => soalMeta.value?.idUjian)

const level: ComputedRef<Level> = computed(() => {
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
