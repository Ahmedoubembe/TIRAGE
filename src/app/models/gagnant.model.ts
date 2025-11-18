export interface Gagnant {
  numero_telephone: string;
  prix: string;
}

export interface GagnantsParCategorie {
  [categorie: string]: Gagnant[];
}
