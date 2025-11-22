// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('tirage');
// }
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { TeleversementCsvComponent } from './components/televersement-csv/televersement-csv';
import { ListeCategoriesComponent } from './components/liste-categories/liste-categories';
import { TirageComponent } from './components/tirage/tirage';
import { AffichageGagnantsComponent } from './components/affichage-gagnants/affichage-gagnants';
import { Client } from './models/client.model';
import { DonneesService } from './services/donnees';

type EtapeApplication = 'UPLOAD' | 'SELECTION' | 'TIRAGE';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TeleversementCsvComponent,
    ListeCategoriesComponent,
    TirageComponent,
    AffichageGagnantsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  @ViewChild(AffichageGagnantsComponent) affichageGagnants!: AffichageGagnantsComponent;
  @ViewChild(TirageComponent) tirageComponent!: TirageComponent;

  etapeActuelle: EtapeApplication = 'UPLOAD';
  categorieSelectionnee: string = '';
  gagnantsAffiches: Client[] = [];
  tirageTermine: boolean = false;
  tirageEnCours: boolean = false;

  constructor(private donneesService: DonneesService) {}

  onFichierCharge(): void {
    this.etapeActuelle = 'SELECTION';
  }

  onCategorieSelectionnee(categorie: string): void {
    this.categorieSelectionnee = categorie;
    this.gagnantsAffiches = [];
    this.tirageTermine = false;
    this.tirageEnCours = true;
    this.etapeActuelle = 'TIRAGE';
  }

  onGagnantRevele(gagnant: Client): void {
    this.tirageEnCours = false;
    this.gagnantsAffiches.push(gagnant);
    if (this.affichageGagnants) {
      this.affichageGagnants.lancerConfettis();
    }
  }

  onGagnantSuivant(): void {
    // Méthode appelée quand l'utilisateur clique sur "Gagnant suivant"
    // Marquer le tirage comme en cours pour cacher le panneau des gagnants
    this.tirageEnCours = true;

    // Appeler la méthode du composant TirageComponent pour lancer un nouveau tirage
    if (this.tirageComponent) {
      this.tirageComponent.lancerTirageSuivant();
    }
  }

  onTirageComplet(): void {
    this.tirageTermine = true;
  }

  onRetourSelection(): void {
    // Marquer la catégorie comme tirée avant de retourner à la sélection
    if (this.categorieSelectionnee) {
      this.donneesService.marquerCategorieTiree(this.categorieSelectionnee);
    }

    this.etapeActuelle = 'SELECTION';
    this.categorieSelectionnee = '';
    this.gagnantsAffiches = [];
    this.tirageTermine = false;
  }
}