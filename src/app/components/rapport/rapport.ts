import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { MasquerNumeroPipe } from '../../pipes/masquer-numero.pipe';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule, MasquerNumeroPipe],
  templateUrl: './rapport.html',
  styleUrl: './rapport.css'
})
export class RapportComponent implements OnInit {
  @Output() retourSelection = new EventEmitter<void>();

  categoriesAvecGagnants: any[] = [];
  dateRapport: string = '';
  totalGagnants: number = 0;
  totalCategories: number = 0;
  categoriesTirees: number = 0;
  clientsJoints: number = 0;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    // Récupérer le récapitulatif depuis le service
    const recap = this.donneesService.getRecapitulatif();
    this.categoriesAvecGagnants = recap.categories;
    this.totalGagnants = recap.totalGagnants;
    this.totalCategories = recap.totalCategories;
    this.categoriesTirees = recap.categoriesTirees;

    // Calculer le nombre de clients joints
    this.clientsJoints = recap.categories
      .flatMap(cat => cat.gagnants)
      .filter(g => g.joint === true)
      .length;

    // Formater la date en français
    const date = new Date();
    this.dateRapport = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  imprimer(): void {
    window.print();
  }

  retourALaSelection(): void {
    this.retourSelection.emit();
  }
}
