import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { Client } from '../../models/client.model';
import { AnimationConfig } from '../../config/animation.config';
import { OptionsConfidentialite } from '../liste-categories/liste-categories';
import { appliquerMasquage } from '../../utilities/masquage';

@Component({
  selector: 'app-tirage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tirage.html',
  styleUrl: './tirage.css'
})
export class TirageComponent implements OnInit {
  @Input() categorieSelectionnee!: string;
  @Input() optionsConfidentialite!: OptionsConfidentialite;
  @Output() gagnantRevele = new EventEmitter<Client>();
  @Output() tirageComplet = new EventEmitter<void>();

  numerosAffiches: string[] = [];
  tousLesClients: Client[] = [];
  gagnants: Client[] = [];
  indexGagnantActuel = 0;
  tirageEnCours = true;
  gagnantActuelFixe: Client | null = null;
  afficherGagnantFixe = false;

  // Mise en évidence du numéro gagnant
  numeroGagnantEnEvidence: string | null = null;
  mettreEnEvidenceNumero = false;

  // Versions masquées pour l'affichage
  prenomAffiche: string = '';
  nomAffiche: string = '';
  numeroAffiche: string = '';

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.tousLesClients = this.donneesService.getClientsByCategorie(this.categorieSelectionnee);
    this.gagnants = this.tousLesClients;
    this.lancerTirageGagnant();
  }

  lancerTirageGagnant(): void {
    this.afficherGagnantFixe = false;
    this.gagnantActuelFixe = null;
    this.mettreEnEvidenceNumero = false;
    this.numeroGagnantEnEvidence = null;

    const debut = Date.now();
    const duree = AnimationConfig.duree_tirage_ms;

    const animer = () => {
      const tempsEcoule = Date.now() - debut;
      const progression = Math.min(tempsEcoule / duree, 1);

      const vitesseActuelle = this.calculerVitesse(progression);

      this.genererNumerosAleatoires();

      if (progression < 1) {
        setTimeout(animer, vitesseActuelle);
      } else {
        // Phase 1 : Mettre en évidence le numéro gagnant dans la liste
        this.mettreEnEvidenceLeNumeroGagnant();
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

  genererNumerosAleatoires(): void {
    this.numerosAffiches = [];
    for (let i = 0; i < AnimationConfig.nombre_numeros_visibles; i++) {
      const clientAleatoire = this.tousLesClients[Math.floor(Math.random() * this.tousLesClients.length)];
      const donneesMasquees = appliquerMasquage(
        clientAleatoire.prenom,
        clientAleatoire.nom,
        clientAleatoire.numero_telephone,
        this.optionsConfidentialite
      );
      this.numerosAffiches.push(donneesMasquees.numero);
    }
  }

  mettreEnEvidenceLeNumeroGagnant(): void {
    const gagnant = this.gagnants[this.indexGagnantActuel];

    // Appliquer le masquage pour obtenir le numéro à mettre en évidence
    const donneesMasquees = appliquerMasquage(
      gagnant.prenom,
      gagnant.nom,
      gagnant.numero_telephone,
      this.optionsConfidentialite
    );

    // Placer le numéro gagnant au centre de la liste
    this.numeroGagnantEnEvidence = donneesMasquees.numero;
    this.numerosAffiches = [];

    // Ajouter quelques numéros avant
    for (let i = 0; i < 2; i++) {
      const clientAleatoire = this.tousLesClients[Math.floor(Math.random() * this.tousLesClients.length)];
      const masque = appliquerMasquage(
        clientAleatoire.prenom,
        clientAleatoire.nom,
        clientAleatoire.numero_telephone,
        this.optionsConfidentialite
      );
      this.numerosAffiches.push(masque.numero);
    }

    // Ajouter le numéro gagnant au centre
    this.numerosAffiches.push(this.numeroGagnantEnEvidence);

    // Ajouter quelques numéros après
    for (let i = 0; i < 2; i++) {
      const clientAleatoire = this.tousLesClients[Math.floor(Math.random() * this.tousLesClients.length)];
      const masque = appliquerMasquage(
        clientAleatoire.prenom,
        clientAleatoire.nom,
        clientAleatoire.numero_telephone,
        this.optionsConfidentialite
      );
      this.numerosAffiches.push(masque.numero);
    }

    this.mettreEnEvidenceNumero = true;

    // Phase 2 : Après 1.5 secondes, afficher la carte complète du gagnant
    setTimeout(() => {
      this.afficherGagnantFixeEtContinuer();
    }, 1500);
  }

  afficherGagnantFixeEtContinuer(): void {
    const gagnant = this.gagnants[this.indexGagnantActuel];
    this.gagnantActuelFixe = gagnant;

    // Appliquer le masquage pour l'affichage
    const donneesMasquees = appliquerMasquage(
      gagnant.prenom,
      gagnant.nom,
      gagnant.numero_telephone,
      this.optionsConfidentialite
    );
    this.prenomAffiche = donneesMasquees.prenom;
    this.nomAffiche = donneesMasquees.nom;
    this.numeroAffiche = donneesMasquees.numero;

    this.afficherGagnantFixe = true;
    this.mettreEnEvidenceNumero = false;

    setTimeout(() => {
      this.gagnantRevele.emit(gagnant);
      this.indexGagnantActuel++;

      if (this.indexGagnantActuel < this.gagnants.length) {
        this.lancerTirageGagnant();
      } else {
        this.tirageEnCours = false;
        this.donneesService.marquerCategorieTiree(this.categorieSelectionnee);

        setTimeout(() => {
          this.tirageComplet.emit();
        }, 1000);
      }
    }, AnimationConfig.duree_affichage_gagnant_fixe_ms);
  }
}