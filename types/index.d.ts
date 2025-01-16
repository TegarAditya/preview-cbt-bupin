declare global {
  interface Meta {
    kodeQRUjian: string
    idUjian: string
    idJenjang: string
    idKelas: string
    idMapel: string
    idBab: string
    namaKelas: string
    namaBab: string
    namaMapel: string
  }

  interface SoalResponse {
    success: boolean
    message: string
    data: SoalData
  }

  interface SoalData {
    id_mapel: number
    nama: string
    soal: Soal[]
  }

  interface Soal {
    nomor: number
    soal: string
    jawaban: Jawaban
    pembahasan: string
    pilA: string
    pilB: string
    pilC: string
    pilD: string
    pilE: string
    file: string
    file1: string
    fileA: string
    fileB: string
    fileC: string
    fileD: string
    fileE: string
  }

  enum Jawaban {
    PilA = 'pilA',
    PilB = 'pilB',
    PilC = 'pilC',
    PilD = 'pilD',
    PilE = 'pilE',
  }

  type Level = 'sd' | 'smp' | 'sma' | 'fallback'
}

export default {}
