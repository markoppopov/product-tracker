import { Component } from '@angular/core';
import { DataService, Product } from '../services/data.service';
import { CommonModule } from '@angular/common'; // Važno za *ngFor
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  products: Product[] = [];

  constructor(private dataService: DataService, private router: Router) {
    this.dataService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  goToDetails(product: Product) {
    // Ovde bi implementirao navigaciju ka detaljima
    console.log("Kliknuto na", product);
  }
}