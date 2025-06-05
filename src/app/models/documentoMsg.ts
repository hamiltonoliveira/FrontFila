export interface DocumentoMSG {
  status:string;
  nomeFila: string;
  dataProcessamento: Date;
  dataEnvio: Date; 
  quantidadeBytes: number;
  registros: number;
  queueName:string;
  descricao: string;
  tipoArquivo:number;
  tipoServico:number;
} 
