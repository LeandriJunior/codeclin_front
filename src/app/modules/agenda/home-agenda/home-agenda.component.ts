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
import ptLocale from "@fullcalendar/core/locales/pt";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import * as dayjs from 'dayjs'
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-home-agenda',
  standalone: true,
  imports: [[ CommonModule, 
              RouterOutlet, 
              FullCalendarModule,
              ReactiveFormsModule,
              FormModule,
              DialogModule,
              DropdownModule,
              ButtonModule,
              ]],
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
      funcionario_agendamento: [null],
      cliente: [null],
      dentista: [null],
      descricao: [null],
    })
  }

  visible: boolean = false;

  dayjs = dayjs

  showDialog(comprimisso_id, data_ini, data_fim) {
      console.log(data_ini, data_fim)
      console.log(this.dayjs(data_ini).format('DD/MM/YYYY HH:mm:ss'))
      console.log(this.dayjs(data_fim).format('DD/MM/YYYY HH:mm:ss'))
      this.formularioCadastroAgenda.get('datetime_ini').setValue(this.dayjs(data_ini).format('DD/MM/YYYY HH:mm:ss'))
      this.formularioCadastroAgenda.get('datetime_fim').setValue(this.dayjs(data_fim).format('DD/MM/YYYY HH:mm:ss'))
      this.visible = true;
  }
  
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'UTC-3',
    locale: 'pt-br',
    locales: [ptLocale],
    slotDuration: '00:15:00',
    slotMinTime: '08:00:00',
    slotMaxTime: '20:15:00',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'title,listWeek',
      center: '',
      right: 'prev,today,next,dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    height:'80vh',
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
    this.showDialog('', selectInfo.startStr, selectInfo.endStr)
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
    console.log(clickInfo.event.id)
    this.showDialog(clickInfo.event.id, clickInfo.event.startStr, clickInfo.event.endStr)
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  onSubmit(){
    console.log(this.formularioCadastroAgenda.value)
  }
  
}
