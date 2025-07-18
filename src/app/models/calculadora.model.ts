export interface Calculadora {
  status: string;
  ativo: boolean;
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
  quantidadeByte:number;
  precoPorRegistro:number;
  tempoDecorridoMs:number;
  precoPorDiaNaFila: Number;
}
