import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-liste-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-categories.html',
  styleUrl: './liste-categories.css'
})
export class ListeCategoriesComponent implements OnInit {
  @Output() categorieSelectionnee = new EventEmitter<string>();
  @Output() tirageLibre = new EventEmitter<void>();
  @Output() voirRapport = new EventEmitter<void>();

  categories: Categorie[] = [];
  categorieChoisie: string | null = null;

  // Traductions pour le titre
  titrePage = {
    ar: 'اختر فئة',
    fr: 'Sélectionnez une catégorie'
  };

  // Traductions pour le bouton
  texteBouton = {
    ar: 'بدء برنامج وفائي',
    fr: 'Lancer le programme WEVAI'
  };

  // Traductions pour le bouton Tirage Libre
  texteBoutonTirageLibre = {
    ar: 'سحب حر',
    fr: 'Tirage Libre'
  };

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.donneesService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  selectionnerCategorie(nomCategorie: string): void {
    this.categorieChoisie = nomCategorie;
  }

  lancerTirage(): void {
    if (this.categorieChoisie) {
      this.categorieSelectionnee.emit(this.categorieChoisie);
    }
  }

  lancerTirageLibre(): void {
    this.tirageLibre.emit();
  }

  allerAuRapport(): void {
    this.voirRapport.emit();
  }

  get aDesGagnants(): boolean {
    // Vérifier s'il y a au moins un gagnant tiré
    return this.donneesService.getGagnants().length > 0;
  }
}

