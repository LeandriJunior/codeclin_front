import { ChangeDetectorRef, Component, OnInit, ViewChild, forwardRef, signal } from '@angular/core';
import { AgendaService } from '../agenda.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import ptLocale from "@fullcalendar/core/locales/pt";

import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';


@Component({
  selector: 'app-home-agenda',
  standalone: true,
  imports: [[ CommonModule, 
              RouterOutlet, 
              FullCalendarModule, 
              DialogModule,
              DropdownModule]],
  templateUrl: './home-agenda.component.html',
  styleUrl: './home-agenda.component.css',
})
export class HomeAgendaComponent{
  formularioCadastroAgenda: FormGroup;
  lista_funcionario: Array<items> = [];

  constructor(private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder,
  ) {
    this.formularioCadastroAgenda = this.formBuilder.group({
      agenda_id: [null],
      datetime_ini: [null],
      datetime_fim: [null],
      funcionario: [null],
      cliente: [null],
      descricao: [null],
    })
  }

  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    locale: 'pt-br',
    locales: [ptLocale],
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.showDialog()
    const title = ''
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  
}
