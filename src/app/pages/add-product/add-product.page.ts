import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

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
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Kreiramo formu koja odgovara poljima u bazi
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async saveProduct() {
    // Uzimamo podatke iz forme
    const productData = this.productForm.value;
    
    // Pozivamo servis da upiše podatke u Firebase
    await this.dataService.addProduct(productData);
    
    // Obaveštavamo korisnika da je uspelo
    const toast = await this.toastController.create({
      message: 'Proizvod je uspešno dodat!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    // Vraćamo se na početnu stranu
    this.router.navigateByUrl('/home');
  }
}