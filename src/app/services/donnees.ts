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

  chargerFichiersCSV(fichierCategories: File, fichierClients: File): Promise<void> {
    return new Promise((resolve, reject) => {
      // Charger le fichier des catégories (délimiteur: virgule)
      Papa.parse(fichierCategories, {
        delimiter: ',',
        skipEmptyLines: true,
        complete: (resultCategories) => {
          try {
            console.log('[DonneesService] Résultat parsing catégories:', resultCategories.data);
            const categories = this.traiterFichierCategories(resultCategories.data as string[][]);

            // Charger le fichier des clients (délimiteur: point-virgule)
            Papa.parse(fichierClients, {
              delimiter: ';',
              skipEmptyLines: true,
              complete: (resultClients) => {
                try {
                  console.log('[DonneesService] Résultat parsing clients:', resultClients.data);
                  const clients = this.traiterFichierClients(resultClients.data as string[][]);

                  // Assigner les catégories aux clients
                  this.assignerCategories(clients, categories);

                  // Publier les données
                  this.categoriesSubject.next(categories);
                  this.clientsSubject.next(clients);

                  resolve();
                } catch (error) {
                  reject(error);
                }
              },
              error: (error) => {
                reject(error);
              }
            });
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

  chargerFichierClientsSeuls(fichierClients: File): Promise<void> {
    return new Promise((resolve, reject) => {
      // Charger uniquement le fichier des clients (délimiteur: point-virgule)
      Papa.parse(fichierClients, {
        delimiter: ';',
        skipEmptyLines: true,
        complete: (resultClients) => {
          try {
            console.log('[DonneesService] Résultat parsing clients (tirage libre):', resultClients.data);
            const clients = this.traiterFichierClients(resultClients.data as string[][]);

            // Trier les clients par score décroissant
            const clientsTries = clients.sort((a, b) => b.score - a.score);

            // Publier les données
            this.categoriesSubject.next([]); // Pas de catégories en mode libre
            this.clientsSubject.next(clientsTries);

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

  private traiterFichierCategories(data: string[][]): Categorie[] {
    const categories: Categorie[] = [];

    for (let i = 0; i < data.length; i++) {
      const ligne = data[i];

      // Ignorer les lignes vides et l'en-tête
      if (!ligne[0] || ligne[0] === '' || ligne[0] === 'categorie') {
        continue;
      }

      // Parser la ligne de catégorie (séparateur: virgule)
      const categorie = {
        categorie: ligne[0].trim(),
        interval: ligne[1].trim().replace(/[\[\]]/g, ''), // Retirer les crochets [3500 - 5000] -> 3500 - 5000
        nombre_gagnants: parseInt(ligne[2]),
        prix: ligne[3].trim(),
        tiree: false
      };

      console.log('[DonneesService] Catégorie parsée:', categorie);
      categories.push(categorie);
    }

    console.log('[DonneesService] Total catégories parsées:', categories.length);

    // Trier les catégories par borne supérieure décroissante (S1 -> S2 -> S3...)
    const categoriesTries = this.trierCategoriesParBorneSuperieure(categories);

    return categoriesTries;
  }

  private traiterFichierClients(data: string[][]): Client[] {
    const clients: Client[] = [];

    for (let i = 0; i < data.length; i++) {
      const ligne = data[i];

      // Ignorer les lignes vides et l'en-tête
      if (!ligne[0] || ligne[0] === '' || ligne[0] === 'tel') {
        continue;
      }

      // PapaCSV a déjà séparé les champs avec le délimiteur ';'
      // ligne = [tel, name, score]
      if (ligne.length >= 3) {
        // Convertir le score: remplacer virgule par point
        const scoreStr = ligne[2].replace(',', '.');
        const score = parseFloat(scoreStr);

        const client = {
          numero_telephone: ligne[0].trim(),
          nom: ligne[1].trim(),
          score: score,
          id_categorie: '' // Sera déterminé par le score et les intervalles
        };

        console.log('[DonneesService] Client parsé:', client);
        clients.push(client);
      }
    }

    console.log('[DonneesService] Total clients parsés:', clients.length);
    return clients;
  }

  private assignerCategories(clients: Client[], categories: Categorie[]): void {
    console.log('[DonneesService] Assignation des catégories');
    console.log('[DonneesService] Nombre de clients:', clients.length);
    console.log('[DonneesService] Nombre de catégories:', categories.length);
    console.log('[DonneesService] Catégories:', categories);

    for (const client of clients) {
      for (const categorie of categories) {
        if (this.scoreCorrespondAInterval(client.score, categorie.interval)) {
          client.id_categorie = categorie.categorie;
          console.log(`[DonneesService] Client ${client.nom} (score: ${client.score}) assigné à ${categorie.categorie} (${categorie.interval})`);
          break;
        }
      }
      if (!client.id_categorie) {
        console.warn(`[DonneesService] ATTENTION: Client ${client.nom} (score: ${client.score}) n'a pas été assigné à une catégorie`);
      }
    }
  }

  private scoreCorrespondAInterval(score: number, interval: string): boolean {
    // Formats possibles: ">3000", "2000-3000", "<2000", "3500 - 5000"
    if (interval.startsWith('>')) {
      const seuil = parseFloat(interval.substring(1));
      return score > seuil;
    } else if (interval.startsWith('<')) {
      const seuil = parseFloat(interval.substring(1));
      return score < seuil;
    } else if (interval.includes('-')) {
      const [min, max] = interval.split('-').map(s => parseFloat(s.trim()));
      console.log(`[DonneesService] Vérification: ${score} dans [${min}, ${max}] ? ${score >= min && score <= max}`);
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

  /**
   * Trie les catégories par borne supérieure décroissante
   * S1 (>3000) -> S2 (2000-3000) -> S3 (<2000)
   */
  private trierCategoriesParBorneSuperieure(categories: Categorie[]): Categorie[] {
    return categories.sort((a, b) => {
      const borneA = this.extraireBorneSuperieure(a.interval);
      const borneB = this.extraireBorneSuperieure(b.interval);

      // Tri décroissant (plus grande borne en premier)
      return borneB - borneA;
    });
  }

  /**
   * Extrait la borne supérieure d'un intervalle
   * Exemples:
   * - ">3000" -> Infinity (aucune limite supérieure)
   * - "2000-3000" -> 3000
   * - "<2000" -> 2000
   */
  private extraireBorneSuperieure(interval: string): number {
    if (interval.startsWith('>')) {
      // Pas de limite supérieure
      return Infinity;
    } else if (interval.startsWith('<')) {
      const seuil = parseFloat(interval.substring(1));
      return seuil;
    } else if (interval.includes('-')) {
      const [min, max] = interval.split('-').map(s => parseFloat(s.trim()));
      return max;
    }
    return 0;
  }

  /**
   * Pousse un client depuis la catégorie suivante vers la catégorie actuelle
   * avec effet cascade : chaque catégorie qui perd un client reçoit un client de la suivante
   * @param currentCategoryId ID de la catégorie actuelle
   * @returns Le client poussé ou null si aucun client disponible
   */
  pushFromNextCategory(currentCategoryId: string): Client | null {
    const categories = this.categoriesSubject.value;

    // Trouver l'index de la catégorie actuelle
    const currentIndex = categories.findIndex(cat => cat.categorie === currentCategoryId);

    if (currentIndex === -1) {
      console.error('[DonneesService] Catégorie actuelle non trouvée:', currentCategoryId);
      return null;
    }

    // Si c'est la dernière catégorie, impossible de pousser
    if (currentIndex === categories.length - 1) {
      console.log('[DonneesService] Dernière catégorie atteinte, impossible de pousser');
      return null;
    }

    const categorieActuelle = categories[currentIndex];

    // Chercher dans les catégories suivantes
    for (let i = currentIndex + 1; i < categories.length; i++) {
      const categorieSuivante = categories[i];
      const clientsDisponibles = this.getClientsTries(categorieSuivante.categorie);

      if (clientsDisponibles.length > 0) {
        // Récupérer le client avec le meilleur score
        const clientAPousser = clientsDisponibles.shift()!;

        // Marquer le client comme poussé et enregistrer sa catégorie d'origine
        clientAPousser.pushed = true;
        clientAPousser.pushedFrom = categorieSuivante.categorie;
        clientAPousser.id_categorie = categorieActuelle.categorie;
        clientAPousser.prix = categorieActuelle.prix;

        // Mettre à jour le cache de la catégorie actuelle
        // Utiliser push() au lieu de unshift() car le client poussé a un score plus bas
        // et doit sortir EN DERNIER au tirage (dernier entré, dernier sorti)
        const clientsCategorieActuelle = this.clientsParCategorieMap.get(categorieActuelle.categorie) || [];
        clientsCategorieActuelle.push(clientAPousser);
        this.clientsParCategorieMap.set(categorieActuelle.categorie, clientsCategorieActuelle);

        console.log('[DonneesService] Client poussé:', clientAPousser);
        console.log('[DonneesService] Depuis:', categorieSuivante.categorie, '-> Vers:', categorieActuelle.categorie);

        // EFFET CASCADE : remplir automatiquement la catégorie qui vient de perdre un client
        // (sauf si c'est la dernière catégorie)
        if (i < categories.length - 1) {
          console.log(`[DonneesService] 🔄 CASCADE: Remplissage de ${categorieSuivante.categorie}...`);
          this.pushFromNextCategory(categorieSuivante.categorie);
        }

        return clientAPousser;
      }
    }

    // Aucun client disponible dans les catégories suivantes
    console.log('[DonneesService] Aucun client disponible dans les catégories suivantes');
    return null;
  }

  /**
   * Vérifie si la catégorie actuelle est la dernière
   */
  isLastCategory(categoryId: string): boolean {
    const categories = this.categoriesSubject.value;
    const currentIndex = categories.findIndex(cat => cat.categorie === categoryId);
    return currentIndex === categories.length - 1;
  }

  /**
   * Récupère tous les gagnants (clients avec est_gagnant = true)
   */
  getGagnants(): Client[] {
    return this.clientsSubject.value.filter(
      client => client.est_gagnant === true
    );
  }

  /**
   * Récupère les gagnants d'une catégorie spécifique
   */
  getGagnantsParCategorie(nomCategorie: string): Client[] {
    return this.clientsSubject.value.filter(
      client => client.id_categorie === nomCategorie && client.est_gagnant === true
    );
  }

  /**
   * Compte le nombre de catégories tirées
   */
  getNombreCategoriesTirees(): number {
    return this.categoriesSubject.value.filter(cat => cat.tiree === true).length;
  }

  /**
   * Récupère le récapitulatif complet pour le rapport
   */
  getRecapitulatif(): {
    totalCategories: number,
    categoriesTirees: number,
    totalGagnants: number,
    categories: Array<{
      nom: string,
      interval: string,
      prix: string,
      gagnantsPrevu: number,
      gagnantsTires: number,
      tiree: boolean,
      gagnants: Client[]
    }>
  } {
    const categories = this.categoriesSubject.value;
    const totalGagnants = this.getGagnants().length;

    const categoriesAvecGagnants = categories.map(cat => {
      const gagnants = this.getGagnantsParCategorie(cat.categorie);
      return {
        nom: cat.categorie,
        interval: cat.interval,
        prix: cat.prix,
        gagnantsPrevu: cat.nombre_gagnants,
        gagnantsTires: gagnants.length,
        tiree: cat.tiree || false,
        gagnants: gagnants
      };
    });

    return {
      totalCategories: categories.length,
      categoriesTirees: this.getNombreCategoriesTirees(),
      totalGagnants: totalGagnants,
      categories: categoriesAvecGagnants
    };
  }
}