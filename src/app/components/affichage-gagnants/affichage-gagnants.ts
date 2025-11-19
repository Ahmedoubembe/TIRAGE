import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class AffichageGagnantsComponent {
  @Input() gagnantsAffiches: Client[] = [];
  @Input() tirageTermine: boolean = false;
  @Input() tirageEnCours: boolean = false;
  @Input() categorieSelectionnee: string = '';
  @Output() retourSelection = new EventEmitter<void>();
  @Output() gagnantSuivant = new EventEmitter<void>();

  afficherConfettis = false;

  constructor(private donneesService: DonneesService) {}

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
    return !this.tirageTermine && this.donneesService.resteDesClients(this.categorieSelectionnee);
  }
}