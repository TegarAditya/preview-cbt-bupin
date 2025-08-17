<template>
  <div v-if="soalMeta">
    <div class="relative min-h-dvh w-full">
      <div class="sticky top-0 left-0 z-10 w-full bg-gray-100">
        <div class="flex items-center justify-start bg-gray-500 px-3 py-2 text-white" v-if="ads">
          <div class="flex w-full items-center justify-between">
            <p class="text-sm">
              Unduh Bupin Scanner di
              <a
                class="underline underline-offset-1"
                href="https://play.google.com/store/apps/details?id=com.mmj.qr_scan&hl=id"
              >
                sini
              </a>
            </p>
            <button @click="ads = false">x</button>
          </div>
        </div>
        <div class="container flex items-center justify-start px-3 py-2">
          <div class="flex flex-col gap-2">
            <h1 class="font-space_grotesk text-lg">{{ soalMeta?.namaBab }}</h1>
            <div>
              <p class="text-sm text-gray-500">{{ soalMeta?.namaMapel }}</p>
              <p class="text-sm text-gray-500">{{ soalMeta?.namaKelas }}</p>
            </div>
          </div>
        </div>
      </div>
  <div class="h-full w-full overflow-y-auto px-5 py-5 pb-10" ref="contentRoot">
        <div class="mx-auto flex max-w-2xl flex-col gap-6" v-if="soalData?.success">
          <div class="soal flex gap-4" v-for="item in soalData?.data.soal">
            <p>{{ item.nomor }}.</p>
            <div class="soal flex flex-col gap-2">
              <div class="text-justify" v-html="item.soal"></div>
              <div class="grid grid-rows-1">
                <div
                  v-for="(optionString, index) in [
                    item.pilA,
                    item.pilB,
                    item.pilC,
                    item.pilD,
                    item.pilE,
                  ]"
                >
                  <div class="opsi flex gap-2" v-if="optionString.length > 0">
                    <span class="font-semibold">{{ indexToChar(index) }}.</span>
                    <div v-html="optionString"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="soalData?.success === false" class="rounded-md border border-gray-300 p-4">
          <p class="font-space_grotesk text-red-500">Soal tidak dapat ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRoute()
const { $zoom } = useNuxtApp()

const ads = ref(true)
const id = ref(router.params.id)
const soalMeta = useState<Meta | undefined>('soalMeta', () => undefined)
const soalData = useState<SoalResponse | undefined>('soalData', () => undefined)
const soalId = computed<string | undefined>(() => soalMeta.value?.idUjian)
const contentRoot = ref<HTMLElement | null>(null)

const level: ComputedRef<Level> = computed(() => {
  if (!soalMeta.value) return 'fallback'

  const kelas = soalMeta.value?.namaKelas

  return kelas.includes('SD') ? 'sd' : kelas.includes('SMP') ? 'smp' : 'sma'
})

function addImageSpinners(root: HTMLElement | null) {
  if (!root) return
  const imgs = root.querySelectorAll('img')
  imgs.forEach(img => {
    if (img.dataset.spinnerAdded) return
    img.dataset.spinnerAdded = 'true'
    const spinner = document.createElement('span')
    spinner.className = 'img-spinner'
    spinner.innerHTML = `<span class="spinner"></span>`
    img.parentNode?.insertBefore(spinner, img)
    function removeSpinner() {
      spinner.remove()
      img.removeEventListener('load', removeSpinner)
      img.removeEventListener('error', removeSpinner)
    }
    img.addEventListener('load', removeSpinner)
    img.addEventListener('error', removeSpinner)
    if (img.complete && img.naturalWidth !== 0) {
      removeSpinner()
    }
  })
}

onMounted(async () => {
  try {
    if (!soalMeta.value || !soalData.value) {
      soalMeta.value = await fetchSoalMeta(id.value as string)
      soalData.value = await fetchSoalData(soalId.value as string, level.value)
    }

    $zoom('img', { background: '#000', margin: 20 })
    nextTick(() => addImageSpinners(contentRoot.value))
  } catch (error: any) {
    console.error(error)
  }
})

watch(soalData, () => {
  nextTick(() => {
    $zoom('img', { background: '#000', margin: 20 })
    addImageSpinners(contentRoot.value)
  })
})
</script>

<style>
.soal ol li {
  list-style-type: decimal;
  margin-left: 1rem;
}
.img-spinner {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-right: 6px;
}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
