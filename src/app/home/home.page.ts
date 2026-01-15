import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, Product } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Dodato za Searchbar
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, cubeOutline, locationOutline, search, filter, businessOutline } from 'ionicons/icons'; // Dodati search i filter
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule], 
})
export class HomePage implements OnInit, OnDestroy {
  products: Product[] = [];      // Lista koja se prikazuje na ekranu (filtrirana)
  allProducts: Product[] = [];   // Svi proizvodi iz baze
  
  // Promenljive za pretragu i filter
  searchTerm: string = '';
  selectedCategory: string = 'Sve';

  authSubscription!: Subscription;

  constructor(
    private dataService: DataService, 
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    // Dodati search i filter u listu ikonica
    addIcons({ add, logOutOutline, cubeOutline, locationOutline, search, filter, businessOutline });
  }

  ngOnInit() {
    this.authSubscription = this.authService.getAuthState().subscribe(user => {
      if (user) {
        console.log("Korisnik:", user.uid);
        
        this.dataService.getProducts(user.uid).subscribe(res => {
          console.log("Stigli proizvodi iz baze:", res);
          
          // cuvamo sve u allProducts, pa filtriramo
          this.allProducts = res;
          this.filterItems(); // Inicijalno popunjavanje products liste
        });
      } else {
        console.log("Nema ulogovanog korisnika.");
        this.router.navigateByUrl('/login');
      }
    });
  }

  // iltriranje
  filterItems() {
    this.products = this.allProducts.filter(product => {
      // 1. Provera teksta (naziv ili zemlja porekla)
      const matchesSearch = 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        product.origin.toLowerCase().includes(this.searchTerm.toLowerCase());

      // 2. Provera kategorije
      const matchesCategory = 
        this.selectedCategory === 'Sve' || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  goToDetails(product: Product) {
    this.router.navigateByUrl(`/product-details/${product.id}`);
  }

  async logout() {
    await this.authService.logout();
    const toast = await this.toastController.create({
      message: 'Uspešno ste se odjavili.',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}