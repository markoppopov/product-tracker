import { Component } from '@angular/core';
import { DataService, Product } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router'; // 1. Dodat RouterLink
import { addIcons } from 'ionicons'; // 2. Alat za ikonice
import { add } from 'ionicons/icons'; // 3. Sama ikonica "+"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  // 4. Ovde moramo dodati RouterLink da bi dugme znalo da prebaci na drugu stranu
  imports: [IonicModule, CommonModule, RouterLink], 
})
export class HomePage {
  products: Product[] = [];

  constructor(private dataService: DataService, private router: Router) {
    // 5. Ovde registrujemo ikonicu da bi se videla
    addIcons({ add });

    this.dataService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  goToDetails(product: Product) {
    // Navigiramo na stranu detalja i šaljemo ID proizvoda
    this.router.navigateByUrl(`/product-details/${product.id}`);
  }
}