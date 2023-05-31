import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest/';

  constructor() { }

  async convertCurrency(from: string, to: string): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}${from}`);
      const rates = response.data.rates;
      const rate = rates[to];
      return rate;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch exchange rates');
    }
  }
}
