import { CUSTOM_ELEMENTS_SCHEMA ,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';
import { HomeAgendaComponent } from './home-agenda/home-agenda.component';
import {TabViewModule} from 'primeng/tabview';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
    declarations: [
      
    ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    AgendaComponent,
    HomeAgendaComponent,
    TabViewModule,
    FullCalendarModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AgendaModule {

 }
