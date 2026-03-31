export interface SizeChartRow {
  size: string
  values: string[]
}

export interface SizeChart {
  title: string
  headers: string[]
  rows: SizeChartRow[]
  note: string
}

// Mapeado por product_id (conforme seed_2_produtos.sql)
export const SIZE_CHARTS: Record<string, SizeChart> = {
  // BERMUDA NYLON
  '6afedb28-7518-4364-a781-d74e08ee4f26': {
    title: 'Tabela de Medidas - Bermudas de Nylon',
    headers: ['TAM', 'Largura', 'Comp.', 'Veste'],
    rows: [
      { size: 'G1', values: ['48', '51', '46-48'] },
      { size: 'G2', values: ['50', '54', '50-52'] },
      { size: 'G3', values: ['54', '57', '52-54'] },
      { size: 'G4', values: ['56', '60', '56-58'] },
      { size: 'G5', values: ['61', '62', '60-62'] },
      { size: 'G6', values: ['66', '64', '64-66'] },
    ],
    note: 'Medidas em centímetros. Pode haver variação de 1-2cm.',
  },

  // BERMUDA MOLETINHO
  'ee3da1b0-902b-4bc4-93de-e5eb8a8611bf': {
    title: 'Tabela de Medidas - Bermudas de Moletinho',
    headers: ['TAM', 'Largura', 'Comp.', 'Veste'],
    rows: [
      { size: 'G1', values: ['48', '55', '46-48'] },
      { size: 'G2', values: ['52', '61', '50-52'] },
      { size: 'G3', values: ['56', '62', '54-56'] },
      { size: 'G4', values: ['61', '64', '58-60'] },
      { size: 'G5', values: ['62', '66', '62-64'] },
      { size: 'G6', values: ['64', '68', '64-66'] },
    ],
    note: 'Medidas em centímetros. Pode haver variação de 1-2cm.',
  },

  // BERMUDA JEANS ZAIWEAR (TAM 50-66)
  '3c3c6a2a-2069-4d9e-af12-da4a9aa784c9': {
    title: 'Tabela de Medidas - Bermudas Jeans com Elastano',
    headers: ['TAM', 'Largura (cm)', 'Comprimento (cm)'],
    rows: [
      { size: '50', values: ['50', '61'] },
      { size: '52', values: ['52', '62'] },
      { size: '54', values: ['54', '63'] },
      { size: '56', values: ['56', '65'] },
      { size: '58', values: ['58', '65'] },
      { size: '60', values: ['60', '66'] },
      { size: '62', values: ['62', '66'] },
      { size: '64', values: ['64', '66'] },
      { size: '66', values: ['66', '68'] },
    ],
    note: 'Medidas em centímetros. Pode haver variação de 1-2cm.',
  },

  // CAMISETA BASIC 100% ALGODAO (Fio 30.1)
  '6fdb75a8-afd4-4404-9e8e-64563c949987': {
    title: 'Tabela de Medidas - Camisetas 100% Algodão Fio 30.1',
    headers: ['TAM', 'Largura (cm)', 'Comprimento (cm)'],
    rows: [
      { size: 'M',     values: ['50.5', '70'] },
      { size: 'G',     values: ['54.5', '72'] },
      { size: 'GG',    values: ['57',   '74'] },
      { size: '6/G1',  values: ['61',   '75'] },
      { size: '7/G2',  values: ['67',   '80'] },
      { size: '8/G3',  values: ['72',   '84'] },
      { size: '9/G4',  values: ['77.5', '87'] },
      { size: '10/G5', values: ['86',   '91.5'] },
      { size: '11/G6', values: ['90',   '96'] },
      { size: '12/G7', values: ['98',   '98'] },
    ],
    note: 'Medidas em centímetros. Pode haver variação de 1-2cm.',
  },

  // CAMISETA PIMA BASIC
  'b1cab6bc-84e4-4fcc-8a9a-18c93b46ac10': {
    title: 'Tabela de Medidas - Camisetas 100% Algodão Pima',
    headers: ['TAM', 'Largura (cm)', 'Comprimento (cm)'],
    rows: [
      { size: 'M',    values: ['50.5', '70'] },
      { size: 'G',    values: ['54.5', '72'] },
      { size: 'GG',   values: ['57',   '74'] },
      { size: '6/G1', values: ['61',   '75'] },
      { size: '7/G2', values: ['67',   '80'] },
      { size: '8/G3', values: ['72',   '84'] },
      { size: '9/G4', values: ['77.5', '87'] },
    ],
    note: 'Medidas em centímetros. Pode haver variação de 1-2cm.',
  },
}
