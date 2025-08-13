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
      <div class="h-full w-full overflow-y-auto px-5 py-5 pb-10">
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
const soalMeta: Ref<Meta | undefined> = ref()
const soalData: Ref<SoalResponse | undefined> = ref()
const soalId: ComputedRef<string | undefined> = computed(() => soalMeta.value?.idUjian)

const level: ComputedRef<Level> = computed(() => {
  if (!soalMeta.value) return 'fallback'

  const kelas = soalMeta.value?.namaKelas

  return kelas.includes('SD') ? 'sd' : kelas.includes('SMP') ? 'smp' : 'sma'
})

onMounted(async () => {
  try {
    soalMeta.value = await fetchSoalMeta(id.value as string)
    soalData.value = await fetchSoalData(soalId.value as string, level.value)

    $zoom('img', { background: '#000', margin: 20 })
  } catch (error: any) {
    console.error(error)
  }
})

watch(soalData, () => {
  nextTick(() => {
    $zoom('img', { background: '#000', margin: 20 })
  })
})
</script>

<style>
.soal ol li {
  list-style-type: decimal;
  margin-left: 1rem;
}
</style>
