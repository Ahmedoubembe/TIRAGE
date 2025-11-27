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

  fichierCategories: File | null = null;
  fichierClients: File | null = null;
  fichierCategoriesCharge = false;
  fichierClientsCharge = false;
  nomFichierCategories = '';
  nomFichierClients = '';

  constructor(private donneesService: DonneesService) {}

  onCategoriesFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierCategories = input.files[0];
      this.nomFichierCategories = this.fichierCategories.name;
      this.fichierCategoriesCharge = true;
      this.erreur = null;
    }
  }

  onClientsFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierClients = input.files[0];
      this.nomFichierClients = this.fichierClients.name;
      this.fichierClientsCharge = true;
      this.erreur = null;
    }
  }

  async chargerLesFichiers(): Promise<void> {
    if (!this.fichierCategories || !this.fichierClients) {
      this.erreur = 'Veuillez sélectionner les deux fichiers';
      return;
    }

    this.chargementEnCours = true;
    this.erreur = null;

    try {
      await this.donneesService.chargerFichiersCSV(this.fichierCategories, this.fichierClients);
      this.fichierCharge.emit();
    } catch (error) {
      this.erreur = 'Erreur lors du chargement des fichiers CSV';
      console.error(error);
    } finally {
      this.chargementEnCours = false;
    }
  }
}