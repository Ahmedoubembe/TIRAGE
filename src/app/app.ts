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
import { ListeCategoriesComponent, OptionsConfidentialite } from './components/liste-categories/liste-categories';
import { TirageComponent } from './components/tirage/tirage';
import { AffichageGagnantsComponent } from './components/affichage-gagnants/affichage-gagnants';
import { Client } from './models/client.model';

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

  etapeActuelle: EtapeApplication = 'UPLOAD';
  categorieSelectionnee: string = '';
  gagnantsAffiches: Client[] = [];
  tirageTermine: boolean = false;
  optionsConfidentialite: OptionsConfidentialite = {
    masquerNom: false,
    masquerNumero: false
  };

  onFichierCharge(): void {
    this.etapeActuelle = 'SELECTION';
  }

  onCategorieSelectionnee(data: {categorie: string, options: OptionsConfidentialite}): void {
    this.categorieSelectionnee = data.categorie;
    this.optionsConfidentialite = data.options;
    this.gagnantsAffiches = [];
    this.tirageTermine = false;
    this.etapeActuelle = 'TIRAGE';
  }

  onGagnantRevele(gagnant: Client): void {
    this.gagnantsAffiches.push(gagnant);
    if (this.affichageGagnants) {
      this.affichageGagnants.lancerConfettis();
    }
  }

  onTirageComplet(): void {
    this.tirageTermine = true;
  }

  onRetourSelection(): void {
    this.etapeActuelle = 'SELECTION';
    this.categorieSelectionnee = '';
    this.gagnantsAffiches = [];
    this.tirageTermine = false;
  }
}