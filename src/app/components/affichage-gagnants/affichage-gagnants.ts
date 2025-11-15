import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { AnimationConfig } from '../../config/animation.config';
import { OptionsConfidentialite } from '../liste-categories/liste-categories';
import { appliquerMasquage } from '../../utilities/masquage';

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
  @Input() optionsConfidentialite!: OptionsConfidentialite;
  @Output() retourSelection = new EventEmitter<void>();

  afficherConfettis = false;

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

  activerPleinEcran(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  /**
   * Obtient les données masquées d'un client selon les options de confidentialité
   */
  obtenirDonneesMasquees(client: Client): {prenom: string, nom: string, numero: string} {
    return appliquerMasquage(
      client.prenom,
      client.nom,
      client.numero_telephone,
      this.optionsConfidentialite
    );
  }
}