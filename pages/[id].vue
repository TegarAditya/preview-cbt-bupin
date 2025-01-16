<template>
  <div v-if="soalMeta">
    <div class="relative w-screen min-h-[100dvh]">
      <div class="sticky z-10 top-0 left-0 w-full bg-gray-100">
        <div class="container flex justify-start items-center py-2 px-3">
          <div class="flex flex-col gap-2">
            <h1 class="font-space_grotesk">{{ soalMeta?.namaBab }}</h1>
            <div>
              <p class="text-xs text-gray-500">{{ soalMeta?.namaMapel }}</p>
              <p class="text-xs text-gray-500">{{ soalMeta?.namaKelas }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-full overflow-y-auto px-5 py-5">
        <div class="pointer-events-none flex select-none flex-col gap-4" v-if="soalData">
          <div class="flex gap-2 text-sm" v-for="item in soalData?.data.soal">
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
        <div v-else-if="isError" class="border border-gray-300 rounded-md p-4">
          <p class="font-space_grotesk text-red-500">Soal tidak dapat ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRoute()

const isError: Ref<boolean> = ref(false)

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
  } catch (error: any) {
    isError.value = true
  }
})
</script>

<style></style>
