export interface chamado {
  titulo: string;
  ativo: boolean;
  descricao: string; 
  dataEncerramento:Date;
  encerrado:boolean;
  status:StatusChamado;
  guidCliente:string; 
 }
   
 export enum StatusChamado {
  Aberto = 0,
  EmAndamento = 1,
  AguardandoResposta = 2,
  Resolvido = 4,
  Fechado = 5,
}
 