export async function fetchSoalMeta(id: string): Promise<Meta> {
  const response = await fetch(`https://buku.bupin.id/api/ujn.php?${id}`)
  const data = await response.json()
  return data
}

export async function fetchSoalData(id: string, level: Level): Promise<SoalResponse> {
  const response = await fetch(`https://cbt.api.bupin.id/api/mapel/${id}?level=${level}`)
  const data = await response.json()
  return data
}

export function indexToChar(index: number): string {
  return String.fromCharCode(index + 65)
}