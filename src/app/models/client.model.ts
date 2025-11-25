export interface Client {
  numero_telephone: string;
  nom: string;
  score: number;
  id_categorie: string;
  prix?: string;
  est_gagnant?: boolean;
  pushed?: boolean; // Indique si le client a été poussé d'une autre catégorie
  pushedFrom?: string; // Nom de la catégorie d'origine du client poussé
  joint?: boolean; // Indique si le client a répondu à l'appel téléphonique
}