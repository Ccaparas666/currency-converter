import { Component } from '@angular/core';
import { CurrencyService } from '../currency.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  amount!: number;
  convertedAmount!: number;

  constructor(private currencyService: CurrencyService) {}

  async convert() {
    if (this.amount && this.fromCurrency && this.toCurrency) {
      try {
        const rate = await this.currencyService.convertCurrency(this.fromCurrency, this.toCurrency);
        this.convertedAmount = this.amount * rate;
      } catch (error) {
        console.error(error);
        // Handle error display or notification
      }
    }
  }
}
