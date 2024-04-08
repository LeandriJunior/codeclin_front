import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAgendaComponent } from './home-agenda/home-agenda.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeAgendaComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
