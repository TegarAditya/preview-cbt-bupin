import { ofetch } from 'ofetch'

const { metaURL, soalURL } = useAppConfig()

export async function fetchSoalMeta(id: string): Promise<Meta> {
  return ofetch(`${metaURL}/api/ujn.php?${id}`)
}

export async function fetchSoalData(id: string, level: Level): Promise<SoalResponse> {
  return ofetch(`${soalURL}/api/mapel/${id}?level=${level}`)
}

export function indexToChar(index: number): string {
  return String.fromCharCode(index + 65)
}