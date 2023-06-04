import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CurrencyService } from '../currency.service';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  amount!: number;
  fromCurrency!: string;
  toCurrency!: string;
  convertedAmount: number | null = null;
  newCurrency!: string;
  currencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  constructor(private alertController: AlertController, private http: HttpClient, private currencyService: CurrencyService) { }
  /////////////// ADD CURRENCY
  async addCurrency() {
    if (this.newCurrency.trim() !== '') {
      const trimmedCurrency = this.newCurrency.trim();
      if (this.currencies.includes(trimmedCurrency)) {
        this.showCurrencyExistsAlert();
        this.newCurrency = ''; // Reset the input field
      }
      else if (await this.isValidCurrency(trimmedCurrency)) {
        this.currencies.push(trimmedCurrency);
        this.newCurrency = ''; // Reset the input field
      } else {
        this.showInvalidCurrencyAlert();
      }
    } else {
      console.log('Invalid currency code');
    }
  }

  async isValidCurrency(currency: string): Promise<boolean> {
    try {
      const response = await this.http.get<any>(`https://v6.exchangerate-api.com/v6/e98d9fa70c2042a4277a86f4/latest/USD`).toPromise();
      const validCurrencies = Object.keys(response.conversion_rates);
      return validCurrencies.includes(currency.toUpperCase());
    } catch (error) {
      console.error('Failed to fetch currency rates', error);
      return false;
    }
  }

  async showCurrencyExistsAlert() {
    const alert = await this.alertController.create({
      header: 'Currency Already Exists',
      message: 'The currency you entered already exists in the currencies choices.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showInvalidCurrencyAlert() {
    try {
      const response = await this.http.get<any>('https://v6.exchangerate-api.com/v6/e98d9fa70c2042a4277a86f4/latest/USD').toPromise();
      const validCurrencies = Object.keys(response.conversion_rates);

      const alert = await this.alertController.create({
        header: 'Invalid Currency',
        message: `The currency you entered is not valid. Valid currencies are: ${validCurrencies.join(', ')}`,
        buttons: ['OK']

      });
      this.newCurrency = ''; // Reset the input field
      this.amount = NaN; // Reset the amount input field
      this.fromCurrency = ''; // Reset the from currency select field
      this.toCurrency = ''; // Reset the to currency select field
      this.convertedAmount = null;
      await alert.present();
    } catch (error) {
      console.error('Failed to fetch currency rates', error);
    }
  }
  /////////// CONVERTING CURRENCY
  async convert() {
    if (this.amount && this.fromCurrency && this.toCurrency) {
      try {
        const rate = await this.currencyService.convertCurrency(this.fromCurrency, this.toCurrency);
        this.convertedAmount = this.amount * rate;
      } catch (error) {

      }
    }
  }
}
