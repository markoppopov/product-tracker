import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular'; // Koristimo Toast umesto Alert-a, lepše je
import { Router, RouterLink } from '@angular/router'; // Dodat RouterLink
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink] // Dodat RouterLink
})
export class LoginPage implements OnInit {
  credentialsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    // Ako forma nije validna, obaveštavamo korisnika ZAŠTO nije validna
    if (this.credentialsForm.invalid) {
      this.showToast('Unesite ispravan email i lozinku.');
      return; 
    }

    const user = this.credentialsForm.value;
    try {
      await this.authService.login(user.email, user.password);
      // Uspešno logovanje
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e) {
      this.showToast('Neuspešno logovanje. Proverite podatke.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}