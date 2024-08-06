import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { CadastrarProdutoComponent } from './cadastrar-produto/cadastrar-produto.component';

export const routes: Routes = [
  { path: '', redirectTo: '/listar-pedidos', pathMatch: 'full' },
  { path: 'listar-pedidos', component: ListarPedidosComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'cadastrar-produto', component: CadastrarProdutoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
