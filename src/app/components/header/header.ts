import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Composant header professionnel pour BAMIS DIGITAL
  // Programme de fidelite avec celebration de l'independance mauritanienne

  // Traductions français/arabe
  traductions = {
    fr: {
      titre: 'PROGRAMME DE FIDÉLITÉ BAMIS DIGITAL',
      sousTitre: 'Tirage au Sort Spécial Indépendance'
    },
    ar: {
      titre: 'برنامج الولاء باميس ديجيتال',
      sousTitre: 'سحب خاص بمناسبة الاستقلال'
    }
  };

  // Langue courante
  langueActive: 'fr' | 'ar' = 'fr';

  // Timer pour alternance
  private intervalId?: number;

  ngOnInit(): void {
    // Démarrer l'alternance toutes les 5 secondes
    this.intervalId = window.setInterval(() => {
      this.langueActive = this.langueActive === 'fr' ? 'ar' : 'fr';
    }, 5000);
  }

  ngOnDestroy(): void {
    // Nettoyer le timer quand le composant est détruit
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Getters pour les textes affichés
  get titre(): string {
    return this.traductions[this.langueActive].titre;
  }

  get sousTitre(): string {
    return this.traductions[this.langueActive].sousTitre;
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      // Entrer en mode plein ecran
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors de l'activation du plein ecran: ${err.message}`);
      });
    } else {
      // Quitter le mode plein ecran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}
