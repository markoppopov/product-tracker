import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Product } from 'src/app/services/data.service';
import { addIcons } from 'ionicons';
// DODALI SMO 'cashOutline' u listu:
import { trash, informationCircleOutline, cubeOutline, locationOutline, businessOutline, cashOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // REGISTRACIJA: Ne zaboravi da je dodaš i ovde!
    addIcons({ trash, informationCircleOutline, cubeOutline, locationOutline, businessOutline, cashOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.dataService.getProductById(id).subscribe(res => {
        this.product = res;
      });
    }
  }

  async deleteProduct() {
    if (!this.product) return;

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
            await this.dataService.deleteProduct(this.product!);
            
            const toast = await this.toastController.create({
              message: 'Proizvod obrisan.',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
            this.router.navigateByUrl('/home');
          }
        }
      ]
    });

    await alert.present();
  }
}