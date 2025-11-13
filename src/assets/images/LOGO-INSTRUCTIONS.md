# INSTRUCTIONS POUR AJOUTER LE LOGO BAMIS DIGITAL

## Emplacement du Logo

Le logo doit être placé dans ce dossier : `src/assets/images/`

## Format et Dimensions

- **Nom du fichier recommandé** : `bamis-digital-logo.png`
- **Dimensions recommandées** : 200px x 60px (ou ratio équivalent)
- **Formats acceptés** : PNG (recommandé pour fond transparent) ou SVG
- **Résolution** : 2x pour écrans Retina (400px x 120px exporté à 200x60)

## Comment Intégrer le Logo

### Option 1 : Image PNG/SVG (Recommandé)

1. Placez votre logo dans ce dossier avec le nom `bamis-digital-logo.png`
2. Ouvrez le fichier : `src/app/components/header/header.html`
3. Remplacez le bloc logo-placeholder par :

```html
<div class="logo-container">
  <img
    src="assets/images/bamis-digital-logo.png"
    alt="Logo BAMIS DIGITAL"
    class="logo-image">
</div>
```

4. Ouvrez le fichier : `src/app/components/header/header.css`
5. Ajoutez ce style après `.logo-placeholder` :

```css
.logo-image {
  width: 200px;
  height: 60px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 6px 25px rgba(255, 215, 0, 0.4));
}
```

### Option 2 : Logo SVG en ligne

Si vous avez un fichier SVG, vous pouvez l'intégrer directement dans le HTML pour plus de contrôle :

```html
<div class="logo-container">
  <svg class="logo-svg" viewBox="0 0 200 60">
    <!-- Copiez le contenu de votre SVG ici -->
  </svg>
</div>
```

## Spécifications Visuelles

### Couleurs Recommandées pour le Logo

Pour s'harmoniser avec le design de l'application :
- **Bleu corporate** : #0066CC
- **Vert mauritanien** : #00A854
- **Jaune doré** : #FFD700
- **Blanc** pour le texte si le logo est sur fond coloré

### Conseils de Design

1. **Contraste** : Assurez-vous que le logo est visible sur le fond bleu-vert du header
2. **Simplicité** : Un logo clair et lisible même en petite taille
3. **Format** : PNG avec fond transparent de préférence
4. **Qualité** : Utilisez une image haute résolution pour les écrans Retina

## Structure des Fichiers

```
src/
└── assets/
    └── images/
        ├── bamis-digital-logo.png          ← Placez votre logo ici
        ├── bamis-digital-logo@2x.png       ← Version haute résolution (optionnel)
        └── LOGO-INSTRUCTIONS.md            ← Ce fichier
```

## Responsive Design

Le logo s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : 200px x 60px
- **Tablette** : 180px x 55px
- **Mobile** : 150px x 45px

Ces ajustements sont déjà configurés dans le CSS du header.

## Test

Après avoir ajouté votre logo :

1. Rechargez l'application
2. Vérifiez que le logo s'affiche correctement
3. Testez le responsive sur mobile/tablette
4. Vérifiez l'animation au survol (hover)

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que le chemin du fichier est correct
2. Assurez-vous que le fichier est bien dans `src/assets/images/`
3. Vérifiez que les dimensions correspondent aux recommandations
4. Testez avec un format différent (PNG vs SVG)

## Placeholder Actuel

Actuellement, un placeholder avec le texte "BAMIS DIGITAL" est affiché.
Il sera automatiquement remplacé dès que vous ajouterez votre vrai logo.

---

**Date de création** : 2025-11-13
**Version de l'application** : Programme de Fidélité - Tirage Indépendance
