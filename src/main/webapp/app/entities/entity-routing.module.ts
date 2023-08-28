import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'bachelier',
        data: { pageTitle: 'Bacheliers' },
        loadChildren: () => import('./bachelier/bachelier.module').then(m => m.BachelierModule),
      },
      {
        path: 'dossier',
        data: { pageTitle: 'Dossiers' },
        loadChildren: () => import('./dossier/dossier.module').then(m => m.DossierModule),
      },
      {
        path: 'campagne',
        data: { pageTitle: 'Campagnes' },
        loadChildren: () => import('./campagne/campagne.module').then(m => m.CampagneModule),
      },
      {
        path: 'annee-scolaire',
        data: { pageTitle: 'AnneeScolaires' },
        loadChildren: () => import('./annee-scolaire/annee-scolaire.module').then(m => m.AnneeScolaireModule),
      },
      {
        path: 'niveau',
        data: { pageTitle: 'Niveaus' },
        loadChildren: () => import('./niveau/niveau.module').then(m => m.NiveauModule),
      },
      {
        path: 'departement',
        data: { pageTitle: 'Departements' },
        loadChildren: () => import('./departement/departement.module').then(m => m.DepartementModule),
      },
      {
        path: 'faculte',
        data: { pageTitle: 'Facultes' },
        loadChildren: () => import('./faculte/faculte.module').then(m => m.FaculteModule),
      },
      {
        path: 'universite',
        data: { pageTitle: 'Universites' },
        loadChildren: () => import('./universite/universite.module').then(m => m.UniversiteModule),
      },
      {
        path: 'depot',
        data: { pageTitle: 'Depots' },
        loadChildren: () => import('./depot/depot.module').then(m => m.DepotModule),
      },
      {
        path: 'inscription',
        data: { pageTitle: 'Inscriptions' },
        loadChildren: () => import('./inscription/inscription.module').then(m => m.InscriptionModule),
      },
      {
        path: 'paiement',
        data: { pageTitle: 'Paiements' },
        loadChildren: () => import('./paiement/paiement.module').then(m => m.PaiementModule),
      },

      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
