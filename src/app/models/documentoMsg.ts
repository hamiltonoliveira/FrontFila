export interface DocumentoMSG {
  Status:string;
  NomeFila: string;
  DataProcessamento: Date;
  DataEnvio: Date; 
  QuantidadeBytes: number;
  QueueName:string;
  descricao: string;
  TipoArquivo:number;
  TipoServico:number
} 
