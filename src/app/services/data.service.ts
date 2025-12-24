import { Injectable } from '@angular/core';
// Dodat 'setDoc' u import listu:
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  origin: string;
  manufacturer: string;
  price: number;
}

// Interfejs za korisnika
export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  // --- PROIZVODI (Ovo ostaje isto) ---
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return docData(productDocRef, { idField: 'id' }) as Observable<Product>;
  }

  addProduct(product: Product) {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product);
  }

  deleteProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(productDocRef);
  }

  updateProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return updateDoc(productDocRef, { 
      name: product.name, 
      origin: product.origin, 
      manufacturer: product.manufacturer,
      price: product.price 
    });
  }

  // --- KORISNICI (NOVO) ---
  // Čuvamo dodatne podatke o korisniku povezano sa njegovim Auth ID-jem
  addUserProfile(user: UserProfile) {
    // Koristimo 'setDoc' da bismo sami odredili ID dokumenta (da bude isti kao Auth UID)
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDocRef, user);
  }
}