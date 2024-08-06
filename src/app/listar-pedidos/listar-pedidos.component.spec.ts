import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarPedidosComponent } from './listar-pedidos.component';
import { PedidosService } from '../pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class ActivatedRouteStub {
  private subject = of({ status: 'todos' });

  get queryParams() {
    return this.subject;
  }
}

describe('ListarPedidosComponent', () => {
  let component: ListarPedidosComponent;
  let fixture: ComponentFixture<ListarPedidosComponent>;
  let pedidosServiceStub: Partial<PedidosService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async () => {
    pedidosServiceStub = {
      listarPedidos: jasmine.createSpy('listarPedidos').and.returnValue(
        of([
          { id: 1, fechado: false, produtos: [], total: 100 },
          { id: 2, fechado: true, produtos: [], total: 200 },
        ])
      ),
      removerProduto: jasmine
        .createSpy('removerProduto')
        .and.returnValue(of('Produto removido com sucesso')),
      fecharPedido: jasmine
        .createSpy('fecharPedido')
        .and.returnValue(of('Pedido fechado com sucesso')),
    };

    activatedRouteStub = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ListarPedidosComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: PedidosService, useValue: pedidosServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with pedidos and apply filter', () => {
    expect(pedidosServiceStub.listarPedidos).toHaveBeenCalled();
    expect(component.pedidos.length).toBe(2);
    expect(component.pedidosFiltrados.length).toBe(2);
  });

  it('should filter pedidos based on status', () => {
    component.statusFiltro = 'abertos';
    component.aplicarFiltro();
    expect(component.pedidosFiltrados.length).toBe(1);

    component.statusFiltro = 'fechados';
    component.aplicarFiltro();
    expect(component.pedidosFiltrados.length).toBe(1);
  });

  it('should update URL when applying filter', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.statusFiltro = 'abertos';
    component.aplicarFiltro();
    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { status: 'abertos' },
      queryParamsHandling: 'merge',
    });
  });

  it('should remove produto and update pedidos', () => {
    component.removerProduto(1, 1);
    expect(pedidosServiceStub.removerProduto).toHaveBeenCalledWith(1, 1);
    expect(component.mensagem).toBe('Produto removido com sucesso');
  });

  it('should fechar pedido and update pedidos', () => {
    component.fecharPedido(1);
    expect(pedidosServiceStub.fecharPedido).toHaveBeenCalledWith(1);
    expect(component.mensagem).toBe('Pedido fechado com sucesso');
  });
});
