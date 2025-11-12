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

  numerosAffiches: string[] = [];
  tousLesClients: Client[] = [];
  gagnants: Client[] = [];
  indexGagnantActuel = 0;
  tirageEnCours = true;
  gagnantActuelFixe: Client | null = null;
  afficherGagnantFixe = false;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.tousLesClients = this.donneesService.getClientsByCategorie(this.categorieSelectionnee);
    this.gagnants = this.tousLesClients;
    this.lancerTirageGagnant();
  }

  lancerTirageGagnant(): void {
    this.afficherGagnantFixe = false;
    this.gagnantActuelFixe = null;
    
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
        this.afficherGagnantFixeEtContinuer();
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
      this.numerosAffiches.push(clientAleatoire.numero_telephone);
    }
  }

  afficherGagnantFixeEtContinuer(): void {
    const gagnant = this.gagnants[this.indexGagnantActuel];
    this.gagnantActuelFixe = gagnant;
    this.afficherGagnantFixe = true;
    
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