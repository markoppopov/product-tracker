import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  authState 
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  // Registracija novog korisnika
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Prijava postojećeg korisnika
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Odjava
  logout() {
    return signOut(this.auth);
  }

  // Provera statusa
  getAuthState() {
    return authState(this.auth);
  }

  // NOVO: Metoda koja vraća auth objekat (da bismo dohvatili currentUser-a)
  getAuth() {
    return this.auth;
  }
}