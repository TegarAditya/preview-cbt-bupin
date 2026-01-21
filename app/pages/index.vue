<template>
  <div
    class="container mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center select-none"
  >
    <div class="mx-5 flex flex-col gap-3">
      <h1 class="font-space_grotesk text-center text-2xl font-semibold">Selamat Datang!</h1>
      <input
        type="text"
        name="idujian"
        id="ujian-input"
        class="w-full min-w-72 rounded-md border border-gray-300 p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none active:outline-none md:h-12 md:w-120 md:min-w-96"
        placeholder="Masukkan ID Ujian"
        v-model="idUjian"
      />
    </div>
    <div
      class="mt-4 flex w-72 justify-between gap-2 rounded-md border border-gray-300 p-4 md:w-120"
    >
      <div>
        <h2 class="font-space_grotesk font-semibold text-gray-700">Status</h2>
        <!-- Loading state for Info -->
        <p v-if="isInfoLoading" class="text-sm text-gray-500">Memuat informasi ujian...</p>
        <p v-else :class="`text-sm ${isInfoAvailable ? 'text-blue-700' : 'text-red-700'}`">
          {{ isInfoAvailable ? 'Informasi ujian tersedia' : 'Informasi ujian tidak tersedia' }}
        </p>
        <!-- Loading state for Content -->
        <p v-if="isContentLoading" class="text-sm text-gray-500">Memuat konten ujian...</p>
        <p v-else :class="`text-sm ${isContentAvailable ? 'text-blue-700' : 'text-red-700'}`">
          {{ isContentAvailable ? 'Konten ujian tersedia' : 'Konten ujian tidak tersedia' }}
        </p>
      </div>
    </div>
    <div
      class="mt-4 flex w-72 flex-wrap flex-col md:flex-row items-center rounded-md border border-gray-300 p-4 md:w-120 shrink-0 md:flex-nowrap md:justify-between"
      v-if="soalMeta?.idUjian && idUjian"
    >
      <div class="max-w-80">
        <h3 class="font-space_grotesk font-semibold text-gray-700">Informasi Ujian</h3>
        <p v-if="soalMeta" class="text-sm text-gray-700">
          <span class="font-semibold">Nama Bab:</span> {{ soalMeta.namaBab }}
        </p>
        <p v-if="soalMeta" class="text-sm text-gray-700">
          <span class="font-semibold">Mata Pelajaran:</span> {{ soalMeta.namaMapel }}
        </p>
        <p v-if="soalMeta" class="text-sm text-gray-700">
          <span class="font-semibold">Kelas:</span> {{ soalMeta.namaKelas }}
        </p>
        <p v-if="soalData?.data.nama" class="text-sm text-gray-700">
          <span class="font-semibold">Soal:</span> {{ soalData.data.nama }}
        </p>
      </div>
      <div v-if="idUjian" class="relative h-56 w-56 md:h-28 md:w-28!">
        <ClientOnly>
          <img :src="qrcode" alt="QR Code" class="aspect-square h-56 w-56! md:h-28 md:w-28!" />
        </ClientOnly>
        <div
          class="group absolute top-0 left-0 z-10 mx-auto flex h-full w-full items-center justify-center"
        >
          <button
            class="font-space_grotesk hidden w-full bg-white px-2 text-center font-semibold text-black md:group-hover:block"
            @click="navigateTo(`/${idUjian}`)"
            v-if="isContentAvailable"
          >
            Buka Soal
          </button>
        </div>
      </div>
      <button
        class="inline-flex md:hidden w-full items-center justify-center rounded-md border border-slate-800 bg-slate-800 px-4 py-2 text-center align-middle font-sans text-sm font-medium text-slate-50 shadow-sm transition-all duration-300 ease-in select-none hover:border-slate-700 hover:bg-slate-700 hover:shadow-md focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none data-[shape=pill]:rounded-full data-[width=full]:w-full"
        @click="navigateTo(`/${idUjian}`)"
        v-if="isContentAvailable"
      >
        Buka Soal
      </button>
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

const soalMeta = useState<Meta | undefined>('soalMeta', () => undefined)
const soalData = useState<SoalResponse | undefined>('soalData', () => undefined)
const soalId = computed<string | undefined>(() => soalMeta.value?.idUjian)
const qrcode = ref<string>('')

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
    const data = await fetchSoalData(soalId.value as string, level.value)
    soalData.value = data.success ? data : undefined
    isContentAvailable.value = !!soalData.value?.data
  } else {
    isContentAvailable.value = false
  }
  isContentLoading.value = false
}

onMounted(() => fetchData(idUjian.value))

watch(idUjian, (id) => fetchData(id))

onMounted(() => {
  const source = computed(() => `https://buku.bupin.id/?${idUjian.value}`)
  const qr = useQRCode(source)
  watchEffect(() => {
    qrcode.value = qr.value || ''
  })
})
</script>

<style></style>
