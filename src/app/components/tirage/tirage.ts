import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { Client } from '../../models/client.model';
import { AnimationConfig } from '../../config/animation.config';

@Component({
  selector: 'app-tirage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tirage.html',
  styleUrl: './tirage.css'
})
export class TirageComponent implements OnInit {
  @Input() categorieSelectionnee!: string;
  @Output() gagnantRevele = new EventEmitter<Client>();
  @Output() tirageComplet = new EventEmitter<void>();

  scoresAffiches: string[] = [];
  tousLesClients: Client[] = [];
  tirageEnCours = true;
  gagnantActuelFixe: Client | null = null;
  afficherGagnantFixe = false;

  // Mise en évidence du score gagnant
  scoreGagnantEnEvidence: string | null = null;
  mettreEnEvidenceScore = false;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    // Pour le défilement : utiliser tous les participants
    this.tousLesClients = this.donneesService.getTousLesParticipantsByCategorie(this.categorieSelectionnee);

    console.log('[TirageComponent] Catégorie sélectionnée:', this.categorieSelectionnee);
    console.log('[TirageComponent] Nombre de clients pour cette catégorie:', this.tousLesClients.length);
    console.log('[TirageComponent] Clients:', this.tousLesClients);

    if (this.tousLesClients.length === 0) {
      console.error('[TirageComponent] ERREUR: Aucun client trouvé pour la catégorie', this.categorieSelectionnee);
      console.log('[TirageComponent] Tous les clients du service:', this.donneesService.getClients());
      console.log('[TirageComponent] Toutes les catégories:', this.donneesService.getCategories());
      return;
    }

    // Lancer le tirage pour révéler le premier gagnant
    this.lancerTirageGagnant();
  }

  lancerTirageGagnant(): void {
    this.afficherGagnantFixe = false;
    this.gagnantActuelFixe = null;
    this.mettreEnEvidenceScore = false;
    this.scoreGagnantEnEvidence = null;

    const debut = Date.now();
    const duree = AnimationConfig.duree_tirage_ms;

    const animer = () => {
      const tempsEcoule = Date.now() - debut;
      const progression = Math.min(tempsEcoule / duree, 1);

      const vitesseActuelle = this.calculerVitesse(progression);

      this.genererScoresAleatoires();

      if (progression < 1) {
        setTimeout(animer, vitesseActuelle);
      } else {
        // Phase 1 : Mettre en évidence le score gagnant dans la liste
        this.mettreEnEvidenceLeScoreGagnant();
      }
    };

    animer();
  }

  calculerVitesse(progression: number): number {
    const vitesseInitiale = AnimationConfig.vitesse_defilement_initiale_ms;
    const vitesseFinale = AnimationConfig.vitesse_defilement_finale_ms;
    
    const facteurRalentissement = Math.pow(progression, 2);
    
    return vitesseInitiale + (vitesseFinale - vitesseInitiale) * facteurRalentissement;
  }

  genererScoresAleatoires(): void {
    const scoresUniques = new Set<string>();
    const nouveauxScores: string[] = [];

    // Limiter le nombre de positions au nombre de participants disponibles
    const nombrePositions = Math.min(
      AnimationConfig.nombre_numeros_visibles,
      this.tousLesClients.length
    );

    // Protection contre les boucles infinies : limite d'itérations
    let tentatives = 0;
    const maxTentatives = this.tousLesClients.length * 3;

    // Générer des scores uniques
    while (nouveauxScores.length < nombrePositions && tentatives < maxTentatives) {
      tentatives++;
      const clientAleatoire = this.tousLesClients[Math.floor(Math.random() * this.tousLesClients.length)];
      const scoreStr = clientAleatoire.score.toFixed(2);

      // Vérifier si le score n'est pas déjà affiché
      if (!scoresUniques.has(scoreStr)) {
        scoresUniques.add(scoreStr);
        nouveauxScores.push(scoreStr);
      }
    }

    this.scoresAffiches = nouveauxScores;
  }

  mettreEnEvidenceLeScoreGagnant(): void {
    // Récupérer le prochain client avec le meilleur score
    const gagnant = this.donneesService.getProchainClient(this.categorieSelectionnee);

    if (!gagnant) {
      // Plus de clients disponibles, terminer le tirage
      this.tirageEnCours = false;
      this.donneesService.marquerCategorieTiree(this.categorieSelectionnee);
      setTimeout(() => {
        this.tirageComplet.emit();
      }, 1000);
      return;
    }

    // Mettre en évidence le score du gagnant
    this.scoreGagnantEnEvidence = gagnant.score.toFixed(2);
    this.scoresAffiches = [this.scoreGagnantEnEvidence];
    this.mettreEnEvidenceScore = true;

    // Afficher immédiatement la carte complète du gagnant
    setTimeout(() => {
      this.afficherGagnantFixeEtContinuer(gagnant);
    }, 800);
  }

  afficherGagnantFixeEtContinuer(gagnant: Client): void {
    // Récupérer la catégorie pour obtenir le prix
    const categorie = this.donneesService.getCategories().find(
      cat => cat.categorie === this.categorieSelectionnee
    );

    // Assigner le prix au gagnant
    if (categorie) {
      gagnant.prix = categorie.prix;
      gagnant.est_gagnant = true;
    }

    this.gagnantActuelFixe = gagnant;
    this.afficherGagnantFixe = true;
    this.mettreEnEvidenceScore = false;

    // Émettre l'événement de révélation
    this.gagnantRevele.emit(gagnant);
  }

  lancerTirageSuivant(): void {
    // Méthode publique pour lancer un nouveau tirage (appelée par le parent)
    this.lancerTirageGagnant();
  }
}