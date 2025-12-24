import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  setDoc,
  query, 
  where 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  userId: string; // NOVO: ID korisnika koji je vlasnik proizvoda
  name: string;
  origin: string;
  manufacturer: string;
  price: number;
  note? : string;
}

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

  // 1. READ (Samo proizvodi ulogovanog korisnika)
  getProducts(userId: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    // Filtriramo: Daj mi proizvode GDE JE userId == trenutni userId
    const q = query(productsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  // 2. READ ONE
  getProductById(id: string): Observable<Product> {
    const productDocRef = doc(this.firestore, `products/${id}`);
    return docData(productDocRef, { idField: 'id' }) as Observable<Product>;
  }

  // 3. CREATE
  addProduct(product: Product) {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product);
  }

  // 4. DELETE
  deleteProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(productDocRef);
  }

  // 5. UPDATE
  updateProduct(product: Product) {
    const productDocRef = doc(this.firestore, `products/${product.id}`);
    return updateDoc(productDocRef, { 
      name: product.name, 
      origin: product.origin, 
      manufacturer: product.manufacturer,
      price: product.price 
    });
  }

  // Korisnički profil
  addUserProfile(user: UserProfile) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDocRef, user);
  }
}