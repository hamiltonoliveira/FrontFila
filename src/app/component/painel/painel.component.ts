import { HttpHeaders } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Calculadora } from 'src/app/models/calculadora.model';
import { DocumentoMSG } from 'src/app/models/documentoMsg';
import { PainelService } from 'src/services/painel.service';

import { saveAs } from 'file-saver';
import { LocalStorageService } from 'src/app/local-storage.service';



@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent {

  Documentacao: DocumentoMSG[] = [];
  documentacaoOriginal: DocumentoMSG[] = [];
  calculadora: Calculadora[] = [];
  carregando = false;

  filtroStatus: string = '';
  filtroFila: string = '';
  filtroData: string = '';
  filtroDescricao: string = '';
  filtroTipo: string = '';
  filtroRegistros?: number;

  dataEnvio!: Date;
  ativo: boolean = true;
  diasRetencao: string = '';
  limiteRegistrosMensal: string = '';
  nomeFila: string = '';
  registros: string = '';
  status: string = '';
  valorMensal: string = '';
  valorPorRegistroExcedente: string = '';
  valorRetencaoExtraPorDia: string = '';
  hoje: Date | undefined;
  valorExcedente: string = '';
  equacao: string = '';

  quantidadeBytes: string = '';
  tempoDecorridoMs: number = 0;
  dias: number = 0;
  tarifa: number = 0;
  private timerId: any;
  countTime: number = 0;


  constructor(private painelService: PainelService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private localStorageService: LocalStorageService) {
    const tipoServico = Number(this.localStorageService.getItem("tipoServico"));
    if (tipoServico) {
      this.carregaDocumentos(tipoServico);
    } else {
      this.localStorageService.setItem("tipoServico", 0);
      this.carregaDocumentos(tipoServico);
    }
  }


  ngOnInit() {
    this.hoje = new Date();
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(_reloadInterval: number | null): void {
    this.localStorageService.removeItem("time");

    const intervaloFinal = _reloadInterval ?? 0;
    this.localStorageService.setItem("time", _reloadInterval);

    this.countTime = intervaloFinal;

    if (_reloadInterval != null)
       this.iniciar();
  }


  clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }


  spinner(valor: boolean) {
    this.carregando = valor;
  }

  abrirCalculadora(valor: any): void {
    this.carregaCalculadora(valor);
  }

  downloadFilaMsg(nomeFila: string): void {
    this.spinner(true);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.painelService.DownloadFila(nomeFila).subscribe({
      next: (blob: Blob) => {
        const filename = `Download_${nomeFila}.json`;
        saveAs(blob, filename);
        this.spinner(false);
      },
      error: (error) => {
        this.spinner(false);
        this.toastr.info('A fila está limpa — nenhuma mensagem disponível.');
      }
    });
  }


  carregaCalculadora(guid: string): void {
    this.painelService.CalculadoraGuid(guid).subscribe({
      next: (dados: Calculadora[]) => {
        this.calculadora = dados ?? [];
        if (this.calculadora.length > 0) {
          const calculo = this.calculadora[0];
          this.dataEnvio = calculo.dataEnvio ?? '';
          this.limiteRegistrosMensal = calculo.limiteRegistrosMensal?.toString() ?? '';
          this.nomeFila = calculo.nomeFila ?? '';
          this.registros = calculo.registros?.toString() ?? '';
          this.status = calculo.status ?? '';
          this.valorMensal = calculo.valorMensal?.toString() ?? '';
          this.valorPorRegistroExcedente = calculo.valorPorRegistroExcedente?.toString() ?? '';
          this.valorRetencaoExtraPorDia = '0.5';
          this.ativo = calculo.ativo;
          this.quantidadeBytes = calculo.quantidadeBytes.toString() ?? '';
          this.tempoDecorridoMs = calculo.tempoDecorridoMs;

          this.dias = Number(this.diasAtraso(this.dataEnvio, this.ativo));

          this.valorExcedente = '';

          if (this.dias >= 3) {
            this.valorExcedente = ((this.dias - 3) * Number(this.valorRetencaoExtraPorDia) * 1).toString();
          }
          else {
            this.valorExcedente = '0';
          }
          this.tarifa = this.dias * 0.5;
          this.equacao = `R$ ${this.tarifa}`;

        }
      },
      error: () => {
        this.spinner(false);
      }
    });
  }

  iniciar(): void {
    const savedInterval = this.localStorageService.getItem("time");

    if (savedInterval == null) return;

    if (savedInterval) {
      const intervalMs = Number(savedInterval);
      this.countTime = intervalMs;

      const startCountdown = () => {
        // Atualiza o contador visual a cada segundo
        const countdownInterval = setInterval(() => {
          this.countTime -= 1000;

          if (this.countTime <= 0) {
            clearInterval(countdownInterval); // Limpa o contador atual
            this.countTime = intervalMs;      // Reinicia o tempo
            location.reload();              // Recarrega a página
          }
        }, 1000);
      };

      startCountdown();

    } else {
      // Define valor padrão e força reload
      this.localStorageService.setItem("time", 60000);
      location.reload();
    }
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.localStorageService.setItem("tipoServico", selectElement.value);
    this.carregaDocumentos(Number(selectElement.value));
  }


  carregaDocumentos(selectedValue: number): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (!guidCliente) return;
    this.spinner(true);
    this.painelService.listarMGS(guidCliente, selectedValue).subscribe({
      next: (dados: DocumentoMSG[]) => {
        this.documentacaoOriginal = dados ?? [];
        this.Documentacao = [...this.documentacaoOriginal];
        this.spinner(false);
      },
      error: () => {
        this.spinner(false);
        this.toastr.error('Erro, Histórico das filas sem conexão');
      }
    });
  }


  getDocumentacaoFiltrada(): DocumentoMSG[] {
    const includesIgnoreCase = (value: any, filter?: string) => {
      if (!filter) return true;
      if (value == null) return false;
      return value.toString().toLowerCase().includes(filter.toLowerCase());
    };

    return this.documentacaoOriginal.filter(item => {
      const dataEnvioStr = item.dataEnvio ? item.dataEnvio.toString() : '';
      const dataEnvioMatch = !this.filtroData || dataEnvioStr.toLowerCase().includes(this.filtroData.toLowerCase());

      return (
        includesIgnoreCase(item.status, this.filtroStatus) &&
        includesIgnoreCase(item.queueName, this.filtroFila) &&
        dataEnvioMatch &&
        includesIgnoreCase(item.descricao, this.filtroDescricao) &&
        includesIgnoreCase(item.tipoArquivo, this.filtroTipo) &&
        (!this.filtroRegistros || item.registros === this.filtroRegistros)
      );
    });
  }

  getCorLinha(dataEnvio: Date, status: string): string {
    const hoje = new Date();
    const envio = new Date(dataEnvio);

    envio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const dias = Math.floor((hoje.getTime() - envio.getTime()) / (1000 * 60 * 60 * 24));

    if (status == 'Consumido') return 'bg-processado-soft';

    if (status == 'Pendente' && dias === 0) return 'bg-norma-soft';
    if (status == 'Pendente' && dias >= 1 && dias < 3) return 'bg-atencao-soft';

    if (status == 'Tarifado' && dias > 3) return 'bg-atrasado-soft';

    return 'bg-normal-soft';
  }


  diasAtraso(dataEnvio: Date, ativo: boolean): number {
    if (ativo == true) {
      const hoje = new Date();
      const envio = new Date(dataEnvio);

      envio.setHours(0, 0, 0, 0);
      hoje.setHours(0, 0, 0, 0);

      const diffEmMs = hoje.getTime() - envio.getTime();
      const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

      return dias > 0 ? dias : 0;
    }
    else {
      return 0;
    }
  }
}
