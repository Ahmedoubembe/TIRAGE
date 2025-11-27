import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesService } from '../../services/donnees';
import { MasquerNumeroPipe } from '../../pipes/masquer-numero.pipe';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule, MasquerNumeroPipe],
  templateUrl: './rapport.html',
  styleUrl: './rapport.css'
})
export class RapportComponent implements OnInit {
  @Output() retourSelection = new EventEmitter<void>();

  categoriesAvecGagnants: any[] = [];
  dateRapport: string = '';
  totalGagnants: number = 0;
  totalCategories: number = 0;
  categoriesTirees: number = 0;
  clientsJoints: number = 0;
  isGeneratingPDF: boolean = false;

  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    // Récupérer le récapitulatif depuis le service
    const recap = this.donneesService.getRecapitulatif();
    this.categoriesAvecGagnants = recap.categories;
    this.totalGagnants = recap.totalGagnants;
    this.totalCategories = recap.totalCategories;
    this.categoriesTirees = recap.categoriesTirees;

    // Calculer le nombre de clients joints
    this.clientsJoints = recap.categories
      .flatMap(cat => cat.gagnants)
      .filter(g => g.joint === true)
      .length;

    // Formater la date en français
    const date = new Date();
    this.dateRapport = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  async telechargerPDF(): Promise<void> {
    this.isGeneratingPDF = true;

    try {
      // Récupérer l'élément du rapport
      const element = document.querySelector('.container-rapport') as HTMLElement;
      if (!element) {
        console.error('Élément du rapport non trouvé');
        return;
      }

      // Cacher temporairement les boutons d'action
      const actionsElement = document.querySelector('.actions-rapport') as HTMLElement;
      if (actionsElement) {
        actionsElement.style.display = 'none';
      }

      // Capturer le contenu HTML avec html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Réafficher les boutons
      if (actionsElement) {
        actionsElement.style.display = 'flex';
      }

      // Créer le PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Si le contenu est plus haut qu'une page, on crée plusieurs pages
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // hauteur d'une page A4

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Générer le nom du fichier avec la date
      const nomFichier = `Rapport_Tirage_${this.dateRapport.replace(/\//g, '-')}.pdf`;

      // Télécharger le PDF
      pdf.save(nomFichier);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  retourALaSelection(): void {
    this.retourSelection.emit();
  }
}
