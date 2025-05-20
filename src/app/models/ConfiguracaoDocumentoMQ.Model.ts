export interface ConfiguracaoDocumentoMQDTO {
  id:number;
  tipoServico: string;
  tipoArquivo: string;
  dataInicio: string; 
  dataFinal: string;
  descricao: string;
  ativo:boolean;
}