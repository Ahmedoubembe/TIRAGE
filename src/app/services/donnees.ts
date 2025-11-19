import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse';
import { Categorie } from '../models/categorie.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class DonneesService {
  private categoriesSubject = new BehaviorSubject<Categorie[]>([]);
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  private clientsParCategorieMap = new Map<string, Client[]>();

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

      // Parser les catégories (séparateur: virgule)
      if (section === 'categories' && ligne[0] !== 'categorie') {
        categories.push({
          categorie: ligne[0],
          interval: ligne[1],
          nombre_gagnants: parseInt(ligne[2]),
          prix: ligne[3],
          tiree: false
        });
      }

      // Parser les clients (séparateur: point-virgule)
      if (section === 'clients' && ligne[0] !== 'tel') {
        // La ligne complète est dans ligne[0], on doit la split par ";"
        const ligneComplete = ligne.join(','); // Rejoindre au cas où Papa a déjà splité
        const parties = ligneComplete.split(';');

        if (parties.length >= 3) {
          // Convertir le score: remplacer virgule par point
          const scoreStr = parties[2].replace(',', '.');
          const score = parseFloat(scoreStr);

          clients.push({
            numero_telephone: parties[0].trim(),
            nom: parties[1].trim(),
            score: score,
            id_categorie: '' // Sera déterminé par le score et les intervalles
          });
        }
      }
    }

    // Assigner les catégories aux clients basé sur leur score
    this.assignerCategories(clients, categories);

    this.categoriesSubject.next(categories);
    this.clientsSubject.next(clients);
  }

  private assignerCategories(clients: Client[], categories: Categorie[]): void {
    for (const client of clients) {
      for (const categorie of categories) {
        if (this.scoreCorrespondAInterval(client.score, categorie.interval)) {
          client.id_categorie = categorie.categorie;
          break;
        }
      }
    }
  }

  private scoreCorrespondAInterval(score: number, interval: string): boolean {
    // Formats possibles: ">3000", "2000-3000", "<2000"
    if (interval.startsWith('>')) {
      const seuil = parseFloat(interval.substring(1));
      return score > seuil;
    } else if (interval.startsWith('<')) {
      const seuil = parseFloat(interval.substring(1));
      return score < seuil;
    } else if (interval.includes('-')) {
      const [min, max] = interval.split('-').map(s => parseFloat(s.trim()));
      return score >= min && score <= max;
    }
    return false;
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
    this.clientsParCategorieMap.clear();
  }

  /**
   * Récupère les clients triés par score décroissant pour une catégorie
   */
  getClientsTries(nomCategorie: string): Client[] {
    // Vérifier si déjà dans le cache
    if (!this.clientsParCategorieMap.has(nomCategorie)) {
      // Récupérer les clients de la catégorie
      const clients = this.clientsSubject.value.filter(
        client => client.id_categorie === nomCategorie
      );

      // Trier par score décroissant
      const clientsTries = [...clients].sort((a, b) => b.score - a.score);

      // Stocker dans la Map
      this.clientsParCategorieMap.set(nomCategorie, clientsTries);
    }

    return this.clientsParCategorieMap.get(nomCategorie) || [];
  }

  /**
   * Retourne et retire le prochain client (meilleur score) de la catégorie
   */
  getProchainClient(nomCategorie: string): Client | null {
    const clients = this.getClientsTries(nomCategorie);

    if (clients.length === 0) {
      return null;
    }

    // Retirer le premier client (meilleur score)
    const prochainClient = clients.shift();

    return prochainClient || null;
  }

  /**
   * Vérifie s'il reste des clients dans une catégorie
   */
  resteDesClients(nomCategorie: string): boolean {
    const clients = this.getClientsTries(nomCategorie);
    return clients.length > 0;
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
}