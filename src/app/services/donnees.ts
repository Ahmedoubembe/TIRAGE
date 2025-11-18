import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse';
import { Categorie } from '../models/categorie.model';
import { Client } from '../models/client.model';
import { GagnantsParCategorie } from '../models/gagnant.model';
import gagnantsData from '../data/gagnants.json';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {
  private categoriesSubject = new BehaviorSubject<Categorie[]>([]);
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  private gagnantsData: GagnantsParCategorie = gagnantsData as GagnantsParCategorie;

  categories$ = this.categoriesSubject.asObservable();
  clients$ = this.clientsSubject.asObservable();

  chargerFichierCSV(fichier: File): Promise<void> {
    return new Promise((resolve, reject) => {
      Papa.parse(fichier, {
        complete: (result) => {
          try {
            this.traiterDonneesCSV(result.data as string[][]);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private traiterDonneesCSV(data: string[][]): void {
    const categories: Categorie[] = [];
    const clients: Client[] = [];
    
    let section = '';
    
    for (let i = 0; i < data.length; i++) {
      const ligne = data[i];
      
      if (ligne[0] === '[CATEGORIES]') {
        section = 'categories';
        continue;
      }
      
      if (ligne[0] === '[CLIENTS]') {
        section = 'clients';
        continue;
      }
      
      if (ligne[0] === '' || ligne.every(cell => cell === '')) {
        continue;
      }
      
      if (section === 'categories' && ligne[0] !== 'categorie') {
        categories.push({
          categorie: ligne[0],
          interval: ligne[1],
          score: parseFloat(ligne[2]),
          nombre_gagnants: parseInt(ligne[3]),
          prix: ligne[4],
          tiree: false
        });
      }
      
      if (section === 'clients' && ligne[0] !== 'nom') {
        clients.push({
          nom: ligne[0],
          prenom: ligne[1],
          numero_telephone: ligne[2],
          id_categorie: ligne[3]
        });
      }
    }
    
    this.categoriesSubject.next(categories);
    this.clientsSubject.next(clients);
  }

  getCategories(): Categorie[] {
    return this.categoriesSubject.value;
  }

  getClients(): Client[] {
    return this.clientsSubject.value;
  }

  getClientsByCategorie(nomCategorie: string): Client[] {
    return this.clientsSubject.value.filter(
      client => client.id_categorie === nomCategorie
    );
  }

  marquerCategorieTiree(nomCategorie: string): void {
    const categories = this.categoriesSubject.value.map(cat => 
      cat.categorie === nomCategorie ? { ...cat, tiree: true } : cat
    );
    this.categoriesSubject.next(categories);
  }

  reinitialiser(): void {
    this.categoriesSubject.next([]);
    this.clientsSubject.next([]);
  }

  /**
   * Récupère tous les participants (pour le défilement)
   */
  getTousLesParticipants(): Client[] {
    return this.clientsSubject.value;
  }

  /**
   * Récupère tous les participants d'une catégorie (pour le défilement)
   */
  getTousLesParticipantsByCategorie(nomCategorie: string): Client[] {
    return this.clientsSubject.value.filter(
      client => client.id_categorie === nomCategorie
    );
  }

  /**
   * Récupère uniquement les gagnants d'une catégorie (pour la révélation)
   * avec leurs prix depuis gagnants.json
   */
  getGagnantsByCategorie(nomCategorie: string): Client[] {
    const gagnantsCategorie = this.gagnantsData[nomCategorie] || [];
    const tousLesClients = this.clientsSubject.value;

    return gagnantsCategorie.map(gagnantData => {
      // Trouver le client correspondant dans la liste des participants
      const client = tousLesClients.find(
        c => c.numero_telephone === gagnantData.numero_telephone &&
             c.id_categorie === nomCategorie
      );

      if (client) {
        // Retourner le client avec le prix du JSON
        return {
          ...client,
          prix: gagnantData.prix,
          est_gagnant: true
        };
      }

      // Si le client n'est pas trouvé dans les participants (ne devrait pas arriver)
      console.warn(`Gagnant ${gagnantData.numero_telephone} non trouvé dans les participants`);
      return null;
    }).filter(c => c !== null) as Client[];
  }

  /**
   * Vérifie si un numéro de téléphone est un gagnant dans une catégorie
   */
  estGagnant(numeroTelephone: string, nomCategorie: string): boolean {
    const gagnantsCategorie = this.gagnantsData[nomCategorie] || [];
    return gagnantsCategorie.some(g => g.numero_telephone === numeroTelephone);
  }

  /**
   * Récupère le prix d'un gagnant
   */
  getPrixGagnant(numeroTelephone: string, nomCategorie: string): string | null {
    const gagnantsCategorie = this.gagnantsData[nomCategorie] || [];
    const gagnant = gagnantsCategorie.find(g => g.numero_telephone === numeroTelephone);
    return gagnant ? gagnant.prix : null;
  }
}