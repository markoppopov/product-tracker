import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router'; 
import { DataService, Product } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddProductPage implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;  
  productId: string | null = null;  

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // Za čitanje ID-ja iz URL-a
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Pravimo praznu formu
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      note: ['']
    });

    // Proveravamo da li smo dosli da menjamo postojeci proizvod
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      // Ako je edit mode, učitaj podatke iz baze u formu
      this.dataService.getProductById(id).subscribe(product => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            origin: product.origin,
            manufacturer: product.manufacturer,
            price: product.price,
            note: product.note
          });
        }
      });
    }
  }

  async saveProduct() {
    const formValues = this.productForm.value;
    const user = this.authService.getAuth().currentUser;

    if (user) {
      const productData: Product = {
        ...formValues,
        userId: user.uid,
        id: this.productId ? this.productId : undefined // Čuvamo stari ID ako je izmena
      };
      
      try {
        if (this.isEditMode) {
          // AŽURIRANJE
          await this.dataService.updateProduct(productData);
          await this.showToast('Uspešna izmena!');
        } else {
          // NOVI UNOS
          await this.dataService.addProduct(productData);
          await this.showToast('Proizvod dodat!');
        }
        this.router.navigateByUrl('/home'); // Vrati na početnu
      } catch (e) {
        await this.showToast('Greška pri čuvanju.', 'danger');
      }
    }
  }

  async showToast(msg: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color
    });
    await toast.present();
  }
}