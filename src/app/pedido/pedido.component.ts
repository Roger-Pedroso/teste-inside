import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { Pedido, Produto } from '../pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  pedido: Pedido = {
    id: 0,
    fechado: false,
    produtos: [],
    total: 0,
  };
  produtos: Produto[] = [];
  produtoSelecionadoId: number | null = 0;
  quantidade: number = 0;
  mensagem: string | undefined;

  constructor(
    private pedidosService: PedidosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pedidoId = this.route.snapshot.paramMap.get('id');
    if (pedidoId) {
      this.pedidosService.getPedidoById(+pedidoId).subscribe((pedido) => {
        if (pedido && pedido.fechado === false) {
          this.pedido = pedido;
        } else {
          this.router.navigate(['/listar-pedidos']);
        }
      });
    }
    this.pedidosService.listarProdutos().subscribe((produtos) => {
      this.produtos = produtos;
    });
  }

  adicionarProduto(): void {
    if (this.produtoSelecionadoId && this.quantidade > 0) {
      const produto = this.produtos.find(
        (p) => p.id == this.produtoSelecionadoId
      );
      const itemExistente = this.pedido.produtos.find(
        (item) => item.produto.id == this.produtoSelecionadoId
      );

      if (itemExistente) {
        itemExistente.quantidade += this.quantidade;
      } else if (produto) {
        this.pedido.produtos.push({ produto, quantidade: this.quantidade });
      }

      this.pedido.total += this.quantidade * (produto?.preco ?? 0);

      this.produtoSelecionadoId = null;
      this.quantidade = 0;
    } else {
      alert('Selecione um produto e insira uma quantidade válida.');
    }
  }

  salvarPedido(): void {
    if (this.pedido.produtos.length > 0) {
      if (this.pedido.id) {
        this.pedidosService.atualizarPedido(this.pedido).subscribe(() => {
          this.router.navigate(['/listar-pedidos']);
        });
      } else {
        this.pedidosService.criarPedido(this.pedido).subscribe(() => {
          this.router.navigate(['/listar-pedidos']);
        });
      }
    } else {
      alert('O pedido deve conter pelo menos um produto.');
    }
  }

  cancelarPedido(): void {
    this.pedidosService.cancelarPedido(this.pedido.id).subscribe(() => {
      this.router.navigate(['/listar-pedidos']);
    });
  }
}
