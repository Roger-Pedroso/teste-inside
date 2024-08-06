import { TestBed } from '@angular/core/testing';
import { PedidosService, Pedido, Produto } from './pedidos.service';
import { of } from 'rxjs';

describe('PedidosService', () => {
  let service: PedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list all pedidos', (done: DoneFn) => {
    service.listarPedidos().subscribe((pedidos) => {
      expect(pedidos.length).toBe(3);
      done();
    });
  });

  it('should list all produtos', (done: DoneFn) => {
    service.listarProdutos().subscribe((produtos) => {
      expect(produtos.length).toBe(5);
      done();
    });
  });

  it('should get pedido by id', (done: DoneFn) => {
    service.getPedidoById(1).subscribe((pedido) => {
      expect(pedido).toBeTruthy();
      expect(pedido?.id).toBe(1);
      done();
    });
  });

  it('should create a new pedido', (done: DoneFn) => {
    service.listarProdutos().subscribe((produtos) => {
      const newPedido: Pedido = {
        id: 0,
        produtos: [{ produto: produtos[0], quantidade: 1 }],
        fechado: false,
        total: 1.5,
      };

      service.criarPedido(newPedido).subscribe((message) => {
        expect(message).toBe('Pedido criado com sucesso.');
        service.listarPedidos().subscribe((pedidos) => {
          expect(pedidos.length).toBe(4);
          done();
        });
      });
    });
  });

  it('should update a pedido', (done: DoneFn) => {
    const updatedPedido: Pedido = {
      id: 1,
      produtos: [],
      fechado: false,
      total: 3,
    };

    service.listarProdutos().subscribe((produtos: Produto[]) => {
      updatedPedido.produtos.push({ produto: produtos[0], quantidade: 2 });
    });

    service.atualizarPedido(updatedPedido).subscribe((message) => {
      expect(message).toBe('Pedido atualizado com sucesso.');
      service.getPedidoById(1).subscribe((pedido) => {
        expect(pedido?.total).toBe(3);
        done();
      });
    });
  });

  it('should close a pedido', (done: DoneFn) => {
    service.fecharPedido(1).subscribe((message) => {
      expect(message).toBe('Pedido fechado com sucesso.');
      service.getPedidoById(1).subscribe((pedido) => {
        expect(pedido?.fechado).toBeTrue();
        done();
      });
    });
  });

  it('should cancel a pedido', (done: DoneFn) => {
    service.cancelarPedido(1).subscribe((message) => {
      expect(message).toBe('Pedido cancelado com sucesso.');
      service.getPedidoById(1).subscribe((pedido) => {
        expect(pedido).toBeNull();
        done();
      });
    });
  });

  it('should add a new produto', (done: DoneFn) => {
    service.cadastrarProduto('Maçã', 4).subscribe((message) => {
      expect(message).toBe('Produto cadastrado com sucesso.');
      service.listarProdutos().subscribe((produtos) => {
        expect(produtos.length).toBe(6);
        done();
      });
    });
  });

  it('should remove a produto from pedido', (done: DoneFn) => {
    service.removerProduto(1, 1).subscribe((message) => {
      expect(message).toBe('Produto removido com sucesso.');
      service.getPedidoById(1).subscribe((pedido) => {
        expect(pedido?.produtos.length).toBeLessThan(3);
        done();
      });
    });
  });
});
