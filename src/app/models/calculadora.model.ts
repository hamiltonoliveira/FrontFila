export interface Calculadora {
  status: string;
  nomeFila: string;
  quantidadeBytes: number;
  registros: number;
  dataEnvio: Date;
  guid: string;
  limiteRegistrosMensal: number;
  diasRetencao: number;
  valorMensal: number;
  valorPorRegistroExcedente: number;
  valorRetencaoExtraPorDia: number;
}
