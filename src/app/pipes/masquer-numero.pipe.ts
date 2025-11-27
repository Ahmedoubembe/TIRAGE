import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masquerNumero',
  standalone: true
})
export class MasquerNumeroPipe implements PipeTransform {
  /**
   * Masque un numéro de téléphone en affichant seulement les 2 premiers et 2 derniers chiffres
   * Exemple: 44750550 -> 44****50
   */
  transform(numero: string): string {
    if (!numero || numero.length < 4) {
      return numero;
    }

    const debut = numero.substring(0, 3);
    const fin = numero.substring(numero.length - 2);
    const nombreEtoiles = numero.length - 5;
    const etoiles = '*'.repeat(nombreEtoiles);

    return `${debut}${etoiles}${fin}`;
  }
}
