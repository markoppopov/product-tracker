import { Component, OnInit, OnDestroy } from '@angular/core'; // Dodato OnInit i OnDestroy
import { DataService, Product } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, cubeOutline, locationOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs'; // Za pravilno upravljanje memorijom

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class HomePage implements OnInit, OnDestroy {
  products: Product[] = [];
  authSubscription!: Subscription; // Čuvamo pretplatu da bismo je ugasili kad izađemo

  constructor(
    private dataService: DataService, 
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ add, logOutOutline, cubeOutline, locationOutline });
  }

  ngOnInit() {
    // OVDE JE PROMENA: Ne pitamo jednom, nego "slušamo" authState
    this.authSubscription = this.authService.getAuthState().subscribe(user => {
      if (user) {
        console.log("Korisnik prepoznat:", user.uid); // Provera u konzoli
        
        // Tek kad imamo korisnika, tražimo njegove proizvode
        this.dataService.getProducts(user.uid).subscribe(res => {
          console.log("Stigli proizvodi iz baze:", res); // Provera šta stiže
          this.products = res;
        });
      } else {
        console.log("Nema ulogovanog korisnika.");
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngOnDestroy() {
    // Dobra praksa: Prekidamo slušanje kad se strana ugasi da ne gušimo memoriju
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  goToDetails(product: Product) {
    this.router.navigateByUrl(`/product-details/${product.id}`);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}