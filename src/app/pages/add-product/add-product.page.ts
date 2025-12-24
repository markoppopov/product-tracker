import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service'; // Import Auth servisa

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddProductPage implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService, // Injektujemo Auth servis
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      note: ['']
    });
  }

  async saveProduct() {
    const formValues = this.productForm.value;
    
    // Dohvatamo trenutnog korisnika
    const user = this.authService.getAuth().currentUser;

    if (user) {
      // Pravimo objekat sa userId-jem
      const productData = {
        ...formValues,
        userId: user.uid
      };
      
      await this.dataService.addProduct(productData);
      
      const toast = await this.toastController.create({
        message: 'Proizvod je uspešno dodat!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigateByUrl('/home');
    } else {
      console.error("Greška: Korisnik nije ulogovan!");
    }
  }
}