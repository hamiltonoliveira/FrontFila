export interface DocumentoMSG {
  guid:string;
  status:string;
  ativo:boolean;
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
