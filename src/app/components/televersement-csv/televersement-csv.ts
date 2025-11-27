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
  @Output() fichierCharge = new EventEmitter<string>(); // Émet le type de tirage

  chargementEnCours = false;
  erreur: string | null = null;

  // Type de tirage
  typeTirage: 'categories' | 'libre' | null = null;
  typeTirageSelectionne = false;

  fichierCategories: File | null = null;
  fichierClients: File | null = null;
  fichierCategoriesCharge = false;
  fichierClientsCharge = false;
  nomFichierCategories = '';
  nomFichierClients = '';

  constructor(private donneesService: DonneesService) {}

  selectionnerTypeTirage(type: 'categories' | 'libre'): void {
    this.typeTirage = type;
    this.typeTirageSelectionne = true;
    this.resetFichiers();
  }

  changerTypeTirage(): void {
    this.typeTirageSelectionne = false;
    this.typeTirage = null;
    this.resetFichiers();
  }

  resetFichiers(): void {
    this.fichierCategories = null;
    this.fichierClients = null;
    this.fichierCategoriesCharge = false;
    this.fichierClientsCharge = false;
    this.nomFichierCategories = '';
    this.nomFichierClients = '';
    this.erreur = null;
  }

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
      this.fichierCharge.emit('categories');
    } catch (error) {
      this.erreur = 'Erreur lors du chargement des fichiers CSV';
      console.error(error);
    } finally {
      this.chargementEnCours = false;
    }
  }

  async chargerFichierClientsSeuls(): Promise<void> {
    if (!this.fichierClients) {
      this.erreur = 'Veuillez sélectionner le fichier des clients';
      return;
    }

    this.chargementEnCours = true;
    this.erreur = null;

    try {
      await this.donneesService.chargerFichierClientsSeuls(this.fichierClients);
      this.fichierCharge.emit('libre');
    } catch (error) {
      this.erreur = 'Erreur lors du chargement du fichier clients';
      console.error(error);
    } finally {
      this.chargementEnCours = false;
    }
  }
}