import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router'; 
import { DataService, Product } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

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
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { 
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      origin: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      note: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.dataService.getProductById(id).subscribe(product => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            category: product.category,
            origin: product.origin,
            manufacturer: product.manufacturer,
            price: product.price,
            note: product.note,
          });
        }
      });
    }
  }

  async saveProduct() {
    const formValues = this.productForm.value;
    const user = this.authService.getAuth().currentUser;

    if (user) {
      const baseProductData = {
        name: formValues.name,
        category: formValues.category,
        origin: formValues.origin,
        manufacturer: formValues.manufacturer,
        price: formValues.price,
        note: formValues.note || '', // da nije undefined
        userId: user.uid
      };
      
      try {
        if (this.isEditMode && this.productId) {
          // AZURIRANJE: Ovde dodajemo ID zbog updateDoc
          const productToUpdate: Product = { 
            ...baseProductData, 
            id: this.productId 
          };
          
          await this.dataService.updateProduct(productToUpdate);
          await this.showToast('Uspešna izmena!');
        } else {
          // addDoc će sam generisati ID
          await this.dataService.addProduct(baseProductData as Product);
          await this.showToast('Proizvod dodat!');
        }
        
        this.router.navigateByUrl('/home'); 

      } catch (e: any) {
        console.error("DETALJI GREŠKE:", e);
        await this.showToast('Greška: ' + e.message, 'danger');
      }
    } else {
      await this.showToast('Korisnik nije ulogovan', 'danger');
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
  async logout() {
    await this.authService.logout();
    await this.showToast('Uspešna odjava.', 'success');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

