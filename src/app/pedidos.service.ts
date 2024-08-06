import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Produto = {
  id: number;
  nome: string;
  preco: number;
};

export type Pedido = {
  id: number;
  produtos: { produto: Produto; quantidade: number }[];
  fechado: boolean;
  total: number;
};

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private produtos: Produto[] = [
    { id: 1, nome: 'Batata', preco: 1.5 },
    { id: 2, nome: 'Cebola', preco: 0.5 },
    { id: 3, nome: 'Alface', preco: 2 },
    { id: 4, nome: 'Tomate', preco: 5 },
    { id: 5, nome: 'Laranja', preco: 3.5 },
  ];
  private pedidos: Pedido[] = [
    {
      id: 1,
      fechado: false,
      total: 15.5,
      produtos: [
        { produto: this.produtos[0], quantidade: 2 },
        { produto: this.produtos[2], quantidade: 1 },
        { produto: this.produtos[4], quantidade: 3 },
      ],
    },
    {
      id: 2,
      fechado: true,
      total: 30.5,
      produtos: [
        { produto: this.produtos[0], quantidade: 2 },
        { produto: this.produtos[2], quantidade: 1 },
        { produto: this.produtos[3], quantidade: 3 },
        { produto: this.produtos[2], quantidade: 4 },
        { produto: this.produtos[1], quantidade: 5 },
      ],
    },
    {
      id: 3,
      fechado: false,
      total: 5,
      produtos: [
        { produto: this.produtos[0], quantidade: 2 },
        { produto: this.produtos[2], quantidade: 1 },
      ],
    },
  ];
  private nextPedidoId = 4;
  private nextProdutoId = 6;

  constructor() {}

  criarPedido(pedido: Pedido): Observable<string> {
    pedido.id = this.nextPedidoId++;
    this.pedidos.push(pedido);
    return of('Pedido criado com sucesso.');
  }

  atualizarPedido(pedido: Pedido): Observable<string> {
    const index = this.pedidos.findIndex((p) => p.id === pedido.id);
    if (index !== -1) {
      this.pedidos[index] = pedido;
      return of('Pedido atualizado com sucesso.');
    }
    return of('Pedido não encontrado.');
  }

  getPedidoById(id: number): Observable<Pedido | null> {
    const pedido = this.pedidos.find((p) => p.id == id) ?? null;
    return of(pedido);
  }

  listarPedidos(): Observable<Pedido[]> {
    return of(this.pedidos);
  }

  listarProdutos(): Observable<Produto[]> {
    return of(this.produtos);
  }

  cadastrarProduto(nome: string, preco: number): Observable<string> {
    if (nome.length > 50) {
      return of('A descrição do produto deve conter no máximo 50 caracteres.');
    }
    const novoProduto: Produto = { id: this.nextProdutoId++, nome, preco };
    this.produtos.push(novoProduto);
    return of('Produto cadastrado com sucesso.');
  }

  removerProduto(pedidoId: number, produtoId: number): Observable<string> {
    const pedido = this.pedidos.find((p) => p.id === pedidoId);
    if (pedido && !pedido.fechado) {
      pedido.produtos = pedido.produtos.filter(
        (p) => p.produto.id !== produtoId
      );
      return of('Produto removido com sucesso.');
    }
    return of('Pedido não encontrado ou já está fechado.');
  }

  fecharPedido(pedidoId: number): Observable<string> {
    const pedido = this.pedidos.find((p) => p.id === pedidoId);
    if (pedido) {
      if (pedido.produtos.length > 0) {
        pedido.fechado = true;
        return of('Pedido fechado com sucesso.');
      } else {
        return of('O pedido deve conter ao menos um produto para ser fechado.');
      }
    }
    return of('Pedido não encontrado.');
  }

  cancelarPedido(pedidoId: number): Observable<string> {
    const index = this.pedidos.findIndex((p) => p.id === pedidoId);
    if (index !== -1) {
      this.pedidos.splice(index, 1);
      return of('Pedido cancelado com sucesso.');
    }
    return of('Pedido não encontrado.');
  }
}
