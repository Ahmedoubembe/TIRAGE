import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService } from '../../services/donnees';
import { Categorie } from '../../models/categorie.model';

export interface OptionsConfidentialite {
  masquerNom: boolean;
  masquerNumero: boolean;
}

@Component({
  selector: 'app-liste-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-categories.html',
  styleUrl: './liste-categories.css'
})
export class ListeCategoriesComponent implements OnInit {
  @Output() categorieSelectionnee = new EventEmitter<{categorie: string, options: OptionsConfidentialite}>();

  categories: Categorie[] = [];
  categorieChoisie: string | null = null;
  afficherModal = false;

  // Options de confidentialité
  masquerNom = false;
  masquerNumero = false;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.donneesService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  selectionnerCategorie(nomCategorie: string): void {
    this.categorieChoisie = nomCategorie;
  }

  ouvrirModalConfidentialite(): void {
    if (this.categorieChoisie) {
      this.afficherModal = true;
    }
  }

  fermerModal(): void {
    this.afficherModal = false;
  }

  confirmerEtLancerTirage(): void {
    if (this.categorieChoisie) {
      const options: OptionsConfidentialite = {
        masquerNom: this.masquerNom,
        masquerNumero: this.masquerNumero
      };
      this.categorieSelectionnee.emit({
        categorie: this.categorieChoisie,
        options: options
      });
      this.fermerModal();
    }
  }
}