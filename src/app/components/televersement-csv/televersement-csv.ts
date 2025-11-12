import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';

@Component({
  selector: 'app-televersement-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './televersement-csv.html',
  styleUrl: './televersement-csv.css'
})
export class TeleversementCsvComponent {
  @Output() fichierCharge = new EventEmitter<void>();
  
  chargementEnCours = false;
  erreur: string | null = null;

  constructor(private donneesService: DonneesService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fichier = input.files[0];
      this.chargerFichier(fichier);
    }
  }

  async chargerFichier(fichier: File): Promise<void> {
    this.chargementEnCours = true;
    this.erreur = null;

    try {
      await this.donneesService.chargerFichierCSV(fichier);
      this.fichierCharge.emit();
    } catch (error) {
      this.erreur = 'Erreur lors du chargement du fichier CSV';
      console.error(error);
    } finally {
      this.chargementEnCours = false;
    }
  }

  activerPleinEcran(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }
}