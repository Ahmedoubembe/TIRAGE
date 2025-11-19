# 🚀 INSTRUCTIONS DE DÉMARRAGE - APPLICATION TIRAGE

## 📋 Prérequis

- Node.js installé (version 16 ou supérieure)
- npm installé

## 🔧 Installation des dépendances

Si ce n'est pas déjà fait, installez les dépendances :

```bash
npm install
```

## ▶️ Démarrer l'application

Pour lancer l'application en mode développement :

```bash
ng serve
# OU
npm start
```

L'application sera accessible à l'adresse : **http://localhost:4200**

## 📁 Format du fichier CSV attendu

Le fichier CSV doit avoir ce format exact :

```csv
[CATEGORIES]
categorie,interval,nombre_gagnants,prix
S1,>3000,2,25000.00 MRU
S2,2000-3000,3,15000.00 MRU
S3,1000-2000,2,10000.00 MRU
S4,<1000,1,5000.00 MRU

[CLIENTS]
tel;name;score
30770077;BASSIROU GOUMBALA;3975,19
46487629;Ahmed Adoud;3600,61
32445566;Mohamed Ould;2850,45
28991234;Fatima Mint;1750,30
27889900;Ali Ba;950,20
```

### Points importants :

1. **Section [CATEGORIES]** :
   - Séparateur : **virgule** (,)
   - Colonnes : `categorie,interval,nombre_gagnants,prix`
   - `interval` peut être : `>3000`, `2000-3000`, `<1000`

2. **Section [CLIENTS]** :
   - Séparateur : **point-virgule** (;)
   - Colonnes : `tel;name;score`
   - Le **score** utilise la **virgule** comme séparateur décimal : `3975,19`
   - Les clients sont automatiquement assignés à leur catégorie selon leur score

## 🎯 Étapes d'utilisation

### 1. Page d'accueil (Upload CSV)
- Vous verrez un bouton **"Choisir un fichier CSV"**
- Cliquez dessus et sélectionnez votre fichier CSV
- Le fichier sera chargé automatiquement

### 2. Sélection de la catégorie
- Une liste des catégories apparaît
- Cliquez sur une catégorie pour la sélectionner
- Cliquez sur **"Lancer le tirage"**

### 3. Animation de tirage
- Les **scores** défilent à l'écran (ex: 3975.19, 3600.61)
- L'animation ralentit progressivement
- Un score est mis en évidence
- Le gagnant est révélé avec : **Téléphone + Score + Prix**

### 4. Affichage des gagnants
- Le panneau passe en **mode plein écran** dès le premier gagnant
- **Confettis** à chaque révélation
- La liste des gagnants s'affiche progressivement
- Bouton **"Gagnant suivant"** pour révéler le prochain gagnant

### 5. Fin du tirage
- Quand tous les gagnants sont révélés, le bouton devient **"Retour à la sélection"**
- Vous pouvez retourner choisir une autre catégorie

## 🐛 Dépannage

### Le bouton de téléversement n'apparaît pas

1. Vérifiez que le serveur de développement est lancé :
   ```bash
   ng serve
   ```

2. Ouvrez la console du navigateur (F12) et vérifiez s'il y a des erreurs

3. Effacez le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

4. Vérifiez que l'URL est bien **http://localhost:4200**

### Erreur lors du chargement du CSV

1. Vérifiez le format du fichier :
   - Section [CATEGORIES] avec virgules
   - Section [CLIENTS] avec point-virgules
   - Scores avec virgule décimale (3975,19)

2. Assurez-vous que le fichier est en **UTF-8** (pas UTF-8 avec BOM)

3. Vérifiez qu'il n'y a pas de lignes vides entre les sections

### L'application ne démarre pas

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Si l'erreur persiste, nettoyez et réinstallez :
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Vérifiez la version de Node.js :
   ```bash
   node --version
   # Doit être >= 16.x
   ```

## 📝 Exemple de fichier CSV complet

Créez un fichier `test.csv` avec ce contenu :

```csv
[CATEGORIES]
categorie,interval,nombre_gagnants,prix
S1,>3000,2,25000.00 MRU
S2,2000-3000,3,15000.00 MRU
S3,1000-2000,2,10000.00 MRU
S4,<1000,1,5000.00 MRU

[CLIENTS]
tel;name;score
30770077;BASSIROU GOUMBALA;3975,19
46487629;Ahmed Adoud;3600,61
45123456;Khadija Ould;3200,50
32445566;Mohamed Ould;2850,45
31987654;Aminata Ba;2450,30
29876543;Cheikh Sidi;2100,75
28991234;Fatima Mint;1750,30
28445566;Ousmane Diallo;1450,60
27889900;Ali Ba;950,20
26778899;Mariam Sy;750,85
25667788;Abdallah Kane;500,40
```

Ce fichier contient :
- 4 catégories (S1, S2, S3, S4)
- 11 clients avec des scores variés
- Les clients seront automatiquement assignés aux bonnes catégories

## ✅ Vérification rapide

Pour vérifier que tout fonctionne :

1. Lancez l'application : `ng serve`
2. Ouvrez http://localhost:4200
3. Vous devez voir :
   - Un header "BAMIS DIGITAL" en haut
   - Un titre "Tirage au Sort"
   - Un texte "Importez votre fichier CSV pour commencer"
   - Un bouton vert "Choisir un fichier CSV"

Si vous ne voyez pas cette page, vérifiez la console du navigateur (F12) pour les erreurs.

## 🆘 Support

Si le problème persiste :

1. Vérifiez les logs de la console du navigateur (F12)
2. Vérifiez les logs du terminal où `ng serve` est lancé
3. Essayez de redémarrer le serveur de développement
4. Essayez un autre navigateur (Chrome, Firefox, Edge)
