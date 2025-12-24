import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Product } from 'src/app/services/data.service';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons'; // Ikonica za brisanje

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null; // Ovde čuvamo učitani proizvod

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ trash });
  }

  ngOnInit() {
    // 1. Uzimamo ID iz URL-a
    const id = this.route.snapshot.paramMap.get('id');
    
    // 2. Ako ID postoji, tražimo podatke iz baze
    if (id) {
      this.dataService.getProductById(id).subscribe(res => {
        this.product = res;
      });
    }
  }

  // Funkcija za brisanje proizvoda
  async deleteProduct() {
    if (!this.product) return;

    // Pitamo korisnika da li je siguran (Alert)
    const alert = await this.alertController.create({
      header: 'Brisanje',
      message: 'Da li ste sigurni da želite da obrišete ovaj proizvod?',
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel'
        },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: async () => {
            // Ako potvrdi, brišemo iz baze
            await this.dataService.deleteProduct(this.product!);
            
            // Prikazujemo poruku
            const toast = await this.toastController.create({
              message: 'Proizvod obrisan.',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();

            // Vraćamo se na početnu
            this.router.navigateByUrl('/home');
          }
        }
      ]
    });

    await alert.present();
  }
}