import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable,throwError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_KEY = 'user_cart';

  constructor(private storage: StorageMap) {}

  getCart(): Observable<any[]> {
    return this.storage.get(this.CART_KEY).pipe(
      take(1),
      map((cart) => (cart as any[]) || [])
    );
  }

  addToCart(item: any): Observable<boolean> {
  return this.getCart().pipe(
    switchMap((cart: any[]) => {
      const index = cart.findIndex((i) => i.id === item.id);
      const existingQuantity = index > -1 ? cart[index].quantity : 0;
      const requestedQuantity = item.quantity;
      const availableStock = Number(item.total_quantity);

      if (existingQuantity + requestedQuantity > availableStock) {
        // Reject addition due to insufficient stock
        return throwError(() => new Error('Not enough stock available.'));
      }

      if (index > -1) {
        cart[index].quantity += requestedQuantity;
      } else {
        cart.push(item);
      }

      return this.storage.set(this.CART_KEY, cart);
    }),
    map(() => true)
  );
}


  removeFromCart(productId: number): Observable<boolean> {
    return this.getCart().pipe(
      switchMap((cart: any[]) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        return this.storage.set(this.CART_KEY, updatedCart);
      }),
      map(() => true)
    );
  }

  clearCart(): Observable<boolean> {
    return this.storage.delete(this.CART_KEY).pipe(map(() => true));
  }
}
