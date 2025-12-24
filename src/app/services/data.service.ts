import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Definišemo kako izgleda jedan proizvod
export interface Product {
  id?: string;
  name: string;
  origin: string;
  manufacturer: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  // 1. READ (Čitanje svih proizvoda)
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  // 2. READ (Čitanje jednog proizvoda po ID-u)
  getProductById(id: string): Observable<Product> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return docData(productDocRef, { idField: 'id' }) as Observable<Product>;
  }

  // 3. CREATE (Dodavanje proizvoda)
  addProduct(product: Product) {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product);
  }

  // 4. DELETE (Brisanje)
  deleteProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(productDocRef);
  }

  // 5. UPDATE (Ažuriranje)
  updateProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return updateDoc(productDocRef, { 
      name: product.name, 
      origin: product.origin, 
      manufacturer: product.manufacturer,
      price: product.price 
    });
  }
}