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
          id_categorie: ligne[3],
          prix: ligne[4],
          est_gagnant: true
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
}