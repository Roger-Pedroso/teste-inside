import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { Pedido } from '../pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.css'],
})
export class ListarPedidosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'status', 'produtos', 'total', 'acoes'];
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  statusFiltro: string = 'todos';
  mensagem: string | undefined;

  constructor(
    private pedidosService: PedidosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.statusFiltro = params['status'] || 'todos';
      this.pedidosService.listarPedidos().subscribe((pedidos) => {
        this.pedidos = pedidos;
        this.aplicarFiltro();
      });
    });
    this.pedidosService.listarPedidos().subscribe((pedidos) => {
      this.pedidos = pedidos;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    if (this.statusFiltro === 'todos') {
      this.pedidosFiltrados = this.pedidos;
    } else if (this.statusFiltro === 'abertos') {
      this.pedidosFiltrados = this.pedidos.filter((pedido) => !pedido.fechado);
    } else if (this.statusFiltro === 'fechados') {
      this.pedidosFiltrados = this.pedidos.filter((pedido) => pedido.fechado);
    }
    this.atualizarUrl();
  }

  atualizarUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: this.statusFiltro },
      queryParamsHandling: 'merge',
    });
  }

  removerProduto(pedidoId: number, produtoId: number): void {
    this.pedidosService
      .removerProduto(pedidoId, produtoId)
      .subscribe((mensagem) => {
        this.mensagem = mensagem;
        this.pedidosService.listarPedidos().subscribe((pedidos) => {
          this.pedidos = pedidos;
          this.aplicarFiltro();
        });
      });
  }

  fecharPedido(pedidoId: number): void {
    this.pedidosService.fecharPedido(pedidoId).subscribe((mensagem) => {
      this.mensagem = mensagem;
      this.pedidosService.listarPedidos().subscribe((pedidos) => {
        this.pedidos = pedidos;
        this.aplicarFiltro();
      });
    });
  }
}
