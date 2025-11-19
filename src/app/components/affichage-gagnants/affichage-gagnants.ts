import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { AnimationConfig } from '../../config/animation.config';
import { DonneesService } from '../../services/donnees';

@Component({
  selector: 'app-affichage-gagnants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './affichage-gagnants.html',
  styleUrl: './affichage-gagnants.css'
})
export class AffichageGagnantsComponent implements OnChanges {
  @Input() gagnantsAffiches: Client[] = [];
  @Input() tirageTermine: boolean = false;
  @Input() tirageEnCours: boolean = false;
  @Input() categorieSelectionnee: string = '';
  @Output() retourSelection = new EventEmitter<void>();
  @Output() gagnantSuivant = new EventEmitter<void>();

  afficherConfettis = false;

  constructor(private donneesService: DonneesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[AffichageGagnants] ngOnChanges:', changes);

    if (changes['tirageTermine']) {
      console.log('  - tirageTermine changé:', changes['tirageTermine'].currentValue);
    }

    if (changes['gagnantsAffiches']) {
      console.log('  - gagnantsAffiches.length:', this.gagnantsAffiches.length);
    }

    if (changes['categorieSelectionnee']) {
      console.log('  - categorieSelectionnee changé:', changes['categorieSelectionnee'].currentValue);
    }
  }

  ajouterGagnant(gagnant: Client): void {
    this.gagnantsAffiches.push(gagnant);
    this.lancerConfettis();
  }

  lancerConfettis(): void {
    this.afficherConfettis = true;
    setTimeout(() => {
      this.afficherConfettis = false;
    }, AnimationConfig.duree_confettis_ms);
  }

  retourALaSelection(): void {
    this.retourSelection.emit();
  }

  onGagnantSuivant(): void {
    this.gagnantSuivant.emit();
  }

  peutAfficherGagnantSuivant(): boolean {
    const resteClients = this.donneesService.resteDesClients(this.categorieSelectionnee);
    console.log('[AffichageGagnants] peutAfficherGagnantSuivant()');
    console.log('  - tirageTermine:', this.tirageTermine);
    console.log('  - categorieSelectionnee:', this.categorieSelectionnee);
    console.log('  - resteDesClients:', resteClients);
    console.log('  - résultat:', !this.tirageTermine && resteClients);
    return !this.tirageTermine && resteClients;
  }
}