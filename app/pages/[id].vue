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
              <p class="text-sm text-gray-700">{{ soalMeta?.namaMapel }}</p>
              <p class="text-sm text-gray-700">{{ soalMeta?.namaKelas }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full w-full overflow-y-auto px-5 py-5 pb-10" ref="contentRoot">
        <div class="mx-auto flex max-w-2xl flex-col gap-6" v-if="soalData?.success">
          <div class="soal flex gap-4" v-for="item in soalData?.data.soal" :key="item.nomor">
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
                  :key="`${item.nomor}-${index}`"
                >
                  <div
                    v-if="optionString.length > 0"
                    class="opsi flex gap-2 rounded-md px-2 py-1 transition-colors"
                    :class="
                      submitted
                        ? item.jawaban === charToJawaban(indexToChar(index))
                          ? 'bg-green-50 text-green-800'
                          : selectedAnswers[item.nomor] === charToJawaban(indexToChar(index))
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-700'
                        : selectedAnswers[item.nomor] === charToJawaban(indexToChar(index))
                          ? 'bg-gray-200 text-gray-900'
                          : 'cursor-pointer hover:bg-gray-100'
                    "
                    @click="selectAnswer(item.nomor, indexToChar(index))"
                  >
                    <span class="font-semibold">{{ indexToChar(index) }}.</span>
                    <span
                      v-if="submitted && item.jawaban === charToJawaban(indexToChar(index))"
                      class="font-semibold text-green-700"
                    >
                      ✓
                    </span>
                    <span
                      v-else-if="
                        submitted &&
                        selectedAnswers[item.nomor] === charToJawaban(indexToChar(index)) &&
                        item.jawaban !== charToJawaban(indexToChar(index))
                      "
                      class="font-semibold text-red-600"
                    >
                      ✕
                    </span>
                    <div v-html="optionString"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-3 pt-2">
            <button
              class="inline-flex w-full items-center justify-center rounded-md border border-slate-800 bg-slate-800 px-4 py-2 text-center align-middle font-sans text-sm font-medium text-slate-50 shadow-sm transition-all duration-300 ease-in select-none hover:border-slate-700 hover:bg-slate-700 hover:shadow-md focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none data-[shape=pill]:rounded-full data-[width=full]:w-full"
              :disabled="submitted || !soalData?.data.soal?.length || !allAnswered"
              @click="submitJawaban"
            >
              Submit
            </button>
            <p v-if="!submitted && soalData?.data.soal?.length && !allAnswered" class="text-sm text-gray-500">
              Lengkapi semua jawaban sebelum submit. ({{ answeredCount }}/{{ totalQuestions }})
            </p>
            <button
              v-if="submitted"
              class="inline-flex w-full items-center justify-center rounded-md border border-gray-500 bg-white px-4 py-2 text-center align-middle font-sans text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 ease-in hover:border-gray-700 hover:bg-gray-100 focus:shadow-none data-[shape=pill]:rounded-full data-[width=full]:w-full"
              @click="resetAttempt"
            >
              Coba Lagi
            </button>
            <p
              v-if="submitted"
              class="font-space_grotesk text-center text-lg font-semibold text-gray-700"
            >
              Nilai: {{ score }}/100
            </p>
          </div>
        </div>
        <div
          v-else-if="soalData?.success === false"
          class="flex w-full items-center justify-center rounded-md border border-gray-300 p-4"
        >
          <p class="font-space_grotesk text-red-500">Soal tidak dapat ditemukan</p>
        </div>
      </div>
    </div>
  </div>
  <div class="p-5" v-else-if="soalMeta === undefined">
    <div class="flex w-full items-center justify-center rounded-md border border-gray-300 p-4">
      <p class="font-space_grotesk text-red-500">ID Soal tidak valid.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { $zoom } = useNuxtApp()

const ads = ref(true)
const id = computed(() => String(route.params.id || ''))
const soalMeta = useState<Meta | undefined>('soalMeta', () => undefined)
const soalData = useState<SoalResponse | undefined>('soalData', () => undefined)
const contentRoot = ref<HTMLElement | null>(null)
const selectedAnswers = ref<Record<number, Jawaban>>({})
const submitted = ref(false)
const score = ref(0)
const totalQuestions = computed(() => soalData.value?.data.soal.length ?? 0)
const answeredCount = computed(() => Object.keys(selectedAnswers.value).length)
const allAnswered = computed(() => totalQuestions.value > 0 && answeredCount.value === totalQuestions.value)

const level: ComputedRef<Level> = computed(() => {
  if (!soalMeta.value) return 'fallback'

  const kelas = soalMeta.value?.namaKelas

  return kelas.includes('SD') ? 'sd' : kelas.includes('SMP') ? 'smp' : 'sma'
})

const soalId = computed<string | undefined>(() => soalMeta.value?.idUjian)

function charToJawaban(char: string): Jawaban {
  return `pil${char}` as Jawaban
}

function selectAnswer(questionNumber: number, optionChar: string) {
  if (submitted.value) return

  selectedAnswers.value = {
    ...selectedAnswers.value,
    [questionNumber]: charToJawaban(optionChar),
  }
}

function submitJawaban() {
  if (!soalData.value?.success || submitted.value || !allAnswered.value) return

  const total = soalData.value.data.soal.length
  const correct = soalData.value.data.soal.reduce((count, item) => {
    return selectedAnswers.value[item.nomor] === item.jawaban ? count + 1 : count
  }, 0)

  score.value = total > 0 ? Math.round((correct / total) * 100) : 0
  submitted.value = true
}

function resetAttempt() {
  selectedAnswers.value = {}
  submitted.value = false
  score.value = 0
}

function addImageSpinners(root: HTMLElement | null) {
  if (!root) return
  const imgs = root.querySelectorAll('img')
  imgs.forEach((img) => {
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

if (!soalMeta.value && id.value) {
  const { data } = await useAsyncData(`meta-${id.value}`, () => fetchSoalMeta(id.value), {
    server: true,
  })
  soalMeta.value = data.value
}

if (!soalData.value && soalId.value) {
  const { data } = await useAsyncData(
    `soal-${soalId.value}-${level.value}`,
    () => fetchSoalData(soalId.value as string, level.value),
    { server: true },
  )
  soalData.value = data.value
}

watch([soalMeta, soalData], () => {
  resetAttempt()
})

watch(id, async (newId) => {
  resetAttempt()

  if (!newId) {
    soalMeta.value = undefined
    soalData.value = undefined
    return
  }

  soalMeta.value = await fetchSoalMeta(newId)

  if (soalMeta.value?.idUjian) {
    soalData.value = await fetchSoalData(soalMeta.value.idUjian, level.value)
  } else {
    soalData.value = undefined
  }
})

onMounted(async () => {
  try {
    if (!soalMeta.value && id.value) {
      soalMeta.value = await fetchSoalMeta(id.value as string)
    }
    if (!soalData.value && soalId.value) {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
