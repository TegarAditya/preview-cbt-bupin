import { ofetch } from 'ofetch'

export async function fetchSoalMeta(id: string): Promise<Meta> {
  const { metaURL } = useAppConfig()
  return ofetch(`${metaURL}/api/ujn.php?${id}`)
}

export async function fetchSoalData(id: string, level: Level): Promise<SoalResponse> {
  const { soalURL } = useAppConfig()
  return ofetch(`${soalURL}/api/mapel/${id}?level=${level}`)
}

export function indexToChar(index: number): string {
  return String.fromCharCode(index + 65)
}