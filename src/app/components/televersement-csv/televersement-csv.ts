import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';

@Component({
  selector: 'app-televersement-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './televersement-csv.html',
  styleUrl: './televersement-csv.css'
})
export class TeleversementCsvComponent implements OnDestroy {
  @Output() fichierCharge = new EventEmitter<void>();

  chargementEnCours = false;
  erreur: string | null = null;

  fichierCategories: File | null = null;
  fichierClients: File | null = null;
  fichierCategoriesCharge = false;
  fichierClientsCharge = false;
  nomFichierCategories = '';
  nomFichierClients = '';

  private fullscreenChangeHandler: (() => void) | null = null;

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

      // Activer le mode plein écran automatiquement après le chargement
      await this.activerPleinEcran();

      this.fichierCharge.emit();
    } catch (error) {
      this.erreur = 'Erreur lors du chargement des fichiers CSV';
      console.error(error);
    } finally {
      this.chargementEnCours = false;
    }
  }

  private async activerPleinEcran(): Promise<void> {
    try {
      const element = document.documentElement;

      // Demander le mode plein écran
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }

      // Écouter les tentatives de sortie du mode plein écran
      this.fullscreenChangeHandler = () => {
        if (!document.fullscreenElement) {
          // Si l'utilisateur tente de sortir du plein écran, le réactiver
          this.activerPleinEcran();
        }
      };

      document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
      document.addEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
      document.addEventListener('MSFullscreenChange', this.fullscreenChangeHandler);

      console.log('Mode plein écran activé');
    } catch (error) {
      console.error('Erreur lors de l\'activation du mode plein écran:', error);
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les écouteurs d'événements
    if (this.fullscreenChangeHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange', this.fullscreenChangeHandler);
    }
  }
}