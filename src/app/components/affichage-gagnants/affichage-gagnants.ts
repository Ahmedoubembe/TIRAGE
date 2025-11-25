import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { AnimationConfig } from '../../config/animation.config';
import { DonneesService } from '../../services/donnees';
import { MasquerNumeroPipe } from '../../pipes/masquer-numero.pipe';

@Component({
  selector: 'app-affichage-gagnants',
  standalone: true,
  imports: [CommonModule, MasquerNumeroPipe],
  templateUrl: './affichage-gagnants.html',
  styleUrl: './affichage-gagnants.css'
})
export class AffichageGagnantsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() gagnantsAffiches: Client[] = [];
  @Input() tirageTermine: boolean = false;
  @Input() tirageEnCours: boolean = false;
  @Input() categorieSelectionnee: string = '';
  @Output() retourSelection = new EventEmitter<void>();
  @Output() gagnantSuivant = new EventEmitter<void>();
  @Output() pousserClient = new EventEmitter<void>();

  afficherConfettis = false;

  // Gestion de la modale de statut contact
  afficherModaleContact = false;
  gagnantSelectionne: Client | null = null;

  // Traductions français/arabe pour "Félicitations aux gagnants"
  traductionsFelicitations = {
    fr: 'FÉLICITATIONS AUX GAGNANTS',
    ar: 'تهانينا للفائزين'
  };

  // Traductions pour les boutons
  traductionsBoutons = {
    gagnantSuivant: {
      ar: 'الفائز التالي',
      fr: 'Gagnant suivant'
    },
    pousser: {
      ar: 'دفع',
      fr: 'Pousser'
    },
    retour: {
      ar: 'العودة إلى الاختيار',
      fr: 'Retour à la sélection'
    }
  };

  // Traduction pour le badge "Poussé"
  traductionBadgePousse = {
    ar: 'مدفوع',
    fr: 'Poussé'
  };

  // Traduction pour "de" (pour "Poussé de X")
  traductionDe = {
    ar: 'من',
    fr: 'de'
  };

  // Langue courante
  langueFelicitations: 'fr' | 'ar' = 'fr';

  // Timer pour alternance
  private intervalFelicitationsId?: number;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    // Démarrer l'alternance toutes les 5 secondes
    this.intervalFelicitationsId = window.setInterval(() => {
      this.langueFelicitations = this.langueFelicitations === 'fr' ? 'ar' : 'fr';
    }, 5000);
  }

  ngOnDestroy(): void {
    // Nettoyer le timer quand le composant est détruit
    if (this.intervalFelicitationsId) {
      clearInterval(this.intervalFelicitationsId);
    }
  }

  // Getter pour le texte affiché
  get titreFelicitations(): string {
    return this.traductionsFelicitations[this.langueFelicitations];
  }

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
    console.log('  - tirageEnCours:', this.tirageEnCours);
    console.log('  - categorieSelectionnee:', this.categorieSelectionnee);
    console.log('  - resteDesClients:', resteClients);
    console.log('  - résultat:', !this.tirageTermine && !this.tirageEnCours && resteClients);

    // Le bouton "Gagnant suivant" s'affiche si:
    // - Le tirage n'est pas terminé
    // - Aucun tirage n'est en cours (pas d'animation)
    // - Il reste des clients dans la catégorie
    return !this.tirageTermine && !this.tirageEnCours && resteClients;
  }

  peutAfficherBoutonsPousser(): boolean {
    const resteClients = this.donneesService.resteDesClients(this.categorieSelectionnee);
    const isLastCategory = this.donneesService.isLastCategory(this.categorieSelectionnee);

    console.log('[AffichageGagnants] peutAfficherBoutonsPousser()');
    console.log('  - tirageTermine:', this.tirageTermine);
    console.log('  - tirageEnCours:', this.tirageEnCours);
    console.log('  - resteDesClients:', resteClients);
    console.log('  - isLastCategory:', isLastCategory);

    // Afficher les boutons [Pousser] et [Retour] si:
    // - Le tirage n'est pas terminé
    // - Aucun tirage n'est en cours
    // - Il ne reste plus de clients dans la catégorie
    return !this.tirageTermine && !this.tirageEnCours && !resteClients;
  }

  peutAfficherBoutonPousser(): boolean {
    const isLastCategory = this.donneesService.isLastCategory(this.categorieSelectionnee);

    // Le bouton "Pousser" ne s'affiche pas si c'est la dernière catégorie
    return this.peutAfficherBoutonsPousser() && !isLastCategory;
  }

  onPousser(): void {
    this.pousserClient.emit();
  }

  // ====================================
  // GESTION MODALE STATUT CONTACT
  // ====================================

  ouvrirModaleContact(gagnant: Client): void {
    // Ne pas ouvrir la modale pendant un tirage en cours
    if (this.tirageEnCours) {
      return;
    }

    this.gagnantSelectionne = gagnant;
    this.afficherModaleContact = true;
    console.log('[AffichageGagnants] Ouverture modale pour', gagnant.numero_telephone);
  }

  marquerJoint(): void {
    if (this.gagnantSelectionne) {
      this.gagnantSelectionne.joint = true;
      console.log(`[AffichageGagnants] Client ${this.gagnantSelectionne.numero_telephone} marqué comme JOINT`);
      this.fermerModale();
    }
  }

  marquerNonJoint(): void {
    if (this.gagnantSelectionne) {
      this.gagnantSelectionne.joint = false;
      console.log(`[AffichageGagnants] Client ${this.gagnantSelectionne.numero_telephone} marqué comme NON JOINT`);
      this.fermerModale();
    }
  }

  fermerModale(): void {
    this.afficherModaleContact = false;
    this.gagnantSelectionne = null;
  }

  // ====================================
  // BADGE POUSSÉ AVEC CATÉGORIE
  // ====================================

  /**
   * Génère le texte du badge "Poussé de [catégorie]" en français
   */
  getTexteBadgePousseFr(gagnant: Client): string {
    if (gagnant.pushedFrom) {
      return `${this.traductionBadgePousse.fr} ${this.traductionDe.fr} ${gagnant.pushedFrom}`;
    }
    return this.traductionBadgePousse.fr;
  }

  /**
   * Génère le texte du badge "Poussé de [catégorie]" en arabe
   */
  getTexteBadgePousseAr(gagnant: Client): string {
    if (gagnant.pushedFrom) {
      return `${this.traductionBadgePousse.ar} ${this.traductionDe.ar} ${gagnant.pushedFrom}`;
    }
    return this.traductionBadgePousse.ar;
  }
}