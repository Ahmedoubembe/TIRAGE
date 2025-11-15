import { OptionsConfidentialite } from '../components/liste-categories/liste-categories';

/**
 * Masque le nom de famille en ne gardant que la première lettre
 * Exemple: "Prénom Nom" => "Prénom N***"
 */
export function masquerNom(prenom: string, nom: string): {prenom: string, nom: string} {
  if (!nom || nom.length === 0) {
    return {prenom, nom};
  }
  const nomMasque = nom.charAt(0) + '***';
  return {prenom, nom: nomMasque};
}

/**
 * Masque le numéro de téléphone en ne gardant que les deux premiers chiffres
 * Exemple: "0612345678" => "06XX XX XX XX"
 */
export function masquerNumeroTelephone(numero: string): string {
  if (!numero || numero.length < 2) {
    return numero;
  }
  // Garde les 2 premiers chiffres et remplace le reste par XX
  const debut = numero.substring(0, 2);
  return `${debut}XX XX XX XX`;
}

/**
 * Applique le masquage sur un client selon les options choisies
 */
export function appliquerMasquage(
  prenom: string,
  nom: string,
  numero: string,
  options: OptionsConfidentialite
): {prenom: string, nom: string, numero: string} {
  let prenomFinal = prenom;
  let nomFinal = nom;
  let numeroFinal = numero;

  if (options.masquerNom) {
    const resultat = masquerNom(prenom, nom);
    prenomFinal = resultat.prenom;
    nomFinal = resultat.nom;
  }

  if (options.masquerNumero) {
    numeroFinal = masquerNumeroTelephone(numero);
  }

  return {
    prenom: prenomFinal,
    nom: nomFinal,
    numero: numeroFinal
  };
}
