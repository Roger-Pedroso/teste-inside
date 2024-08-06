import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarProdutoComponent } from './cadastrar-produto.component';
import { PedidosService } from '../pedidos.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('CadastrarProdutoComponent', () => {
  let component: CadastrarProdutoComponent;
  let fixture: ComponentFixture<CadastrarProdutoComponent>;
  let pedidosServiceMock: jasmine.SpyObj<PedidosService>;

  beforeEach(async () => {
    pedidosServiceMock = jasmine.createSpyObj('PedidosService', [
      'cadastrarProduto',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CadastrarProdutoComponent],
      imports: [FormsModule],
      providers: [{ provide: PedidosService, useValue: pedidosServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cadastrarProduto on the service when cadastrarProduto is called', () => {
    pedidosServiceMock.cadastrarProduto.and.returnValue(
      of('Produto cadastrado com sucesso.')
    );
    component.nomeProduto = 'Teste Produto';
    component.precoProduto = 100;

    component.cadastrarProduto();

    expect(pedidosServiceMock.cadastrarProduto).toHaveBeenCalledWith(
      'Teste Produto',
      100
    );
  });

  it('should set mensagem and clear inputs on successful produto registration', () => {
    pedidosServiceMock.cadastrarProduto.and.returnValue(
      of('Produto cadastrado com sucesso.')
    );
    component.nomeProduto = 'Teste Produto';
    component.precoProduto = 100;

    component.cadastrarProduto();

    expect(component.mensagem).toBe('Produto cadastrado com sucesso.');
    expect(component.nomeProduto).toBe('');
    expect(component.precoProduto).toBe(0);
  });

  it('should set mensagem without clearing inputs on failed product registration', () => {
    const errorMsg = 'Erro ao cadastrar produto.';
    pedidosServiceMock.cadastrarProduto.and.returnValue(of(errorMsg));
    component.nomeProduto = 'Teste Produto';
    component.precoProduto = 100;

    component.cadastrarProduto();

    expect(component.mensagem).toBe(errorMsg);
    expect(component.nomeProduto).toBe('Teste Produto');
    expect(component.precoProduto).toBe(100);
  });
});
