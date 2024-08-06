import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { CadastrarProdutoComponent } from './cadastrar-produto/cadastrar-produto.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const appRoutes: Routes = [
  { path: 'listar-pedidos', component: ListarPedidosComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'pedido/:id', component: PedidoComponent },
  { path: 'cadastrar-produto', component: CadastrarProdutoComponent },
  { path: '', redirectTo: '/listar-pedidos', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ListarPedidosComponent,
    PedidoComponent,
    CadastrarProdutoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
