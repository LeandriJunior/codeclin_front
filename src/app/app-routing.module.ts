import { AppLayoutComponent } from './core/layout/app.layout.component';
import { AutenticacaoComponent } from './core/autenticacao/autenticacao.component';
import { NaoEncontradaComponent } from './core/nao-encontrada/nao-encontrada.component';
import { PermissaoNegadaComponent } from './core/permissao-negada/permissao-negada.component';
import { AutenticacaoGuard } from './core/guards/autenticacao.guard';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: AutenticacaoComponent
  },
  {
    path: '',
    redirectTo: 'agenda/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppLayoutComponent,
    data: { animationState: 'AppLayoutComponent' },
    canLoad: [AutenticacaoGuard],
    canActivateChild: [AutenticacaoGuard],
    children: [
      {
        path: '403',
        component: PermissaoNegadaComponent,
      },
      {
        path: '404',
        component: NaoEncontradaComponent,
      },
      {
        path: 'wiki',
        loadChildren: () => 
          import(
            './modules/wiki/wiki.module'
          ).then(m => m.WikiModule)
      },
      {
        path: 'agenda',
        loadChildren: () => 
          import(
            './modules/agenda/agenda.module'
          ).then(m => m.AgendaModule)
      },
      {
        path: '**',
        redirectTo: ''
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    data: { animationState: 'FullPath' },
  },
];

export class AppRoutingModule {
  static routing: ModuleWithProviders<RouterModule> =
    RouterModule.forRoot(APP_ROUTES);
}
