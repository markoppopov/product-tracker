import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    // Ako forma nije validna, prekidamo i obaveštavamo korisnika (ili pustimo HTML da prikaže greške)
    if (this.registerForm.invalid) {
      this.showToast('Molimo popunite sva polja ispravno.');
      return;
    }

    const { firstName, lastName, email, password } = this.registerForm.value;

    const loading = await this.loadingController.create({ message: 'Registracija...' });
    await loading.present();

    try {
      // 1. Kreiramo nalog u Firebase Authentication
      const userCredential = await this.authService.register(email, password);
      const user = userCredential.user;

      // 2. Čuvamo dodatne podatke u Firestore bazi
      await this.dataService.addUserProfile({
        id: user.uid, // Povezujemo sa Auth ID-jem
        firstName,
        lastName,
        email
      });

      await loading.dismiss();
      this.showToast('Uspešna registracija! Molimo prijavite se.');
      
      // 3. Vraćamo na Login stranu
      this.router.navigateByUrl('/login');

    } catch (e) {
      await loading.dismiss();
      this.showToast('Greška: ' + (e as any).message);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}