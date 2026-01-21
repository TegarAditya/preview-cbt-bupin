import { ofetch } from 'ofetch'

export async function fetchSoalMeta(id: string): Promise<Meta | undefined> {
  const { metaURL } = useAppConfig()
  try {
    return await ofetch(`${metaURL}/api/ujn.php?${id}`, { retry: 1 })
  } catch (error) {
    console.error('fetchSoalMeta failed:', error)
    return undefined
  }
}

export async function fetchSoalData(id: string, level: Level): Promise<SoalResponse> {
  const { soalURL } = useAppConfig()
  try {
    return await ofetch(`${soalURL}/api/mapel/${id}?level=${level}`, { retry: 1 })
  } catch (error: any) {
    const status = error?.response?.status || error?.status || 0
    const message = status ? `Request failed with status ${status}` : 'Network or server error'
    return {
      success: false,
      message,
      data: { id_mapel: 0, nama: '', soal: [] },
    }
  }
}

export function indexToChar(index: number): string {
  return String.fromCharCode(index + 65)
}