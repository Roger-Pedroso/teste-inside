import { Component } from '@angular/core';
import { PedidosService } from '../pedidos.service';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrar-produto.component.html',
  styleUrls: ['./cadastrar-produto.component.css'],
})
export class CadastrarProdutoComponent {
  nomeProduto = '';
  precoProduto = 0;
  mensagem: string | undefined;

  constructor(private pedidosService: PedidosService) {}

  cadastrarProduto(): void {
    this.pedidosService
      .cadastrarProduto(this.nomeProduto, this.precoProduto)
      .subscribe((mensagem) => {
        this.mensagem = mensagem;
        if (mensagem === 'Produto cadastrado com sucesso.') {
          this.nomeProduto = '';
          this.precoProduto = 0;
        }
      });
  }
}
