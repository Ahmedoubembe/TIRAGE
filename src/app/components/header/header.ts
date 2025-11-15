import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // Composant header professionnel pour BAMIS DIGITAL
  // Programme de fidelite avec celebration de l'independance mauritanienne

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
