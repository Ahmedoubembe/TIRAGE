export interface Categorie {
  categorie: string;
  interval: string;
  nombre_gagnants: number;
  prix: string;
  tiree?: boolean;
  vide?: boolean; // Indique si la catégorie n'a pas de clients
}