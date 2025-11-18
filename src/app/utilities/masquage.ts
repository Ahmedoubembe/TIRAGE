import { OptionsConfidentialite } from '../components/liste-categories/liste-categories';


export function masquerNom(prenom: string, nom: string): {prenom: string, nom: string} {
  if (!nom || nom.length === 0) {
    return {prenom, nom};
  }
  // const nomMasque = nom.charAt(0) + '***';
  const nomMasque = nom.substring(0,3) + '***';
  return {prenom, nom: nomMasque};
}


export function masquerNumeroTelephone(numero: string): string {
  if (!numero || numero.length < 2) {
    return numero;
  }

  const debut = numero.substring(0, 10);
  return `${debut} XX XX`;
}


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
