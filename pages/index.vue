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
        class="w-full min-w-72 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 active:outline-none md:h-12 md:w-[30rem] md:min-w-96"
        placeholder="Masukkan ID Ujian"
        v-model="idUjian"
      />
    </div>
    <div
      class="mt-4 flex w-72 justify-between gap-2 rounded-md border border-gray-300 p-4 md:w-[30rem]"
    >
      <div>
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
    </div>
    <div
      class="mt-4 flex w-72 flex-wrap justify-between rounded-md border border-gray-300 p-4 md:w-[30rem] md:flex-nowrap"
      v-if="soalMeta?.idUjian && idUjian"
    >
      <div>
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
        <p v-if="soalData?.data.nama" class="text-sm text-gray-500">
          <span class="font-semibold">Soal:</span> {{ soalData.data.nama }}
        </p>
      </div>
      <div v-if="idUjian" class="relative h-28 w-28">
        <img :src="qrcode.value" alt="QR Code" class="h-28 w-28" />
        <div
          class="group absolute left-0 top-0 z-10 mx-auto flex h-full w-full items-center justify-center"
        >
          <button
            class="hidden w-full bg-white px-2 text-center font-space_grotesk font-semibold text-black group-hover:block"
            @click="navigateTo(`/${idUjian}`)"
          >
            Click me
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'

const idUjian = ref<string>('')
const isInfoAvailable = ref<boolean>(false)
const isContentAvailable = ref<boolean>(false)
const isInfoLoading = ref<boolean>(false)
const isContentLoading = ref<boolean>(false)

const soalMeta = ref<Meta | undefined>()
const soalData = ref<SoalResponse | undefined>()
const soalId = computed<string | undefined>(() => soalMeta.value?.idUjian)

const qrcode = computed(() => useQRCode(`https://buku.bupin.id/?${idUjian.value}`))

const level = computed<Level>(() => {
  if (!soalMeta.value) return 'fallback'

  const kelas = soalMeta.value?.namaKelas

  return kelas.includes('SD') ? 'sd' : kelas.includes('SMP') ? 'smp' : 'sma'
})

const fetchData = async (id: string) => {
  if (id.length === 0) {
    isInfoAvailable.value = false
    isContentAvailable.value = false
    return
  }

  isInfoLoading.value = true
  isContentLoading.value = true

  soalMeta.value = await fetchSoalMeta(id)
  isInfoAvailable.value = !!soalMeta.value?.idUjian
  isInfoLoading.value = false

  if (soalMeta.value?.idUjian) {
    soalData.value = await fetchSoalData(soalId.value as string, level.value)
    isContentAvailable.value = !!soalData.value?.data
  } else {
    isContentAvailable.value = false
  }
  isContentLoading.value = false
}

onMounted(() => fetchData(idUjian.value))

watch(idUjian, (id) => fetchData(id))
</script>

<style></style>
