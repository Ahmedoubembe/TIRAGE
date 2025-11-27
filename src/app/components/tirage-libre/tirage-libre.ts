import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { Client } from '../../models/client.model';
import { MasquerNumeroPipe } from '../../pipes/masquer-numero.pipe';

@Component({
  selector: 'app-tirage-libre',
  standalone: true,
  imports: [CommonModule, MasquerNumeroPipe],
  templateUrl: './tirage-libre.html',
  styleUrl: './tirage-libre.css'
})
export class TirageLibreComponent implements OnInit {
  @Output() retourAccueil = new EventEmitter<void>();

  clientsRestants: Client[] = [];
  clientActuel: Client | null = null;
  indexActuel = 0;
  afficherClient = false;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    // Récupérer tous les clients triés
    this.clientsRestants = this.donneesService.getClients();

    console.log('[TirageLibreComponent] Nombre total de clients:', this.clientsRestants.length);

    if (this.clientsRestants.length > 0) {
      this.afficherClientActuel();
    }
  }

  afficherClientActuel(): void {
    if (this.indexActuel < this.clientsRestants.length) {
      this.afficherClient = false;

      // Petit délai pour l'animation
      setTimeout(() => {
        this.clientActuel = this.clientsRestants[this.indexActuel];
        this.afficherClient = true;
      }, 300);
    } else {
      this.clientActuel = null;
    }
  }

  clientSuivant(): void {
    this.indexActuel++;
    this.afficherClientActuel();
  }

  retour(): void {
    this.retourAccueil.emit();
  }

  get nombreClientsRestants(): number {
    return this.clientsRestants.length - this.indexActuel;
  }

  get positionActuelle(): number {
    return this.indexActuel + 1;
  }
}
