import { ChangeDetectorRef, Component, OnInit, ViewChild, forwardRef, signal } from '@angular/core';
import { AgendaService } from '../agenda.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, DatesSetArg } from '@fullcalendar/core';
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
import { CardModule } from 'primeng/card';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';


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
              CardModule,
              
              ]],
  templateUrl: './home-agenda.component.html',
  styleUrl: './home-agenda.component.css',
})
export class HomeAgendaComponent{
  data_ini_agenda: any 
  data_fim_agenda: any
  formularioCadastroAgenda: FormGroup;
  eventos_agenda:any = [];
  lista_funcionario: Array<items> = [];
  lista_clientes: Array<items> = [];
  funcionario_agendamento = ''
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private agendaService: AgendaService,
    private toastrService: ToastrService,
  ){
    this.formularioCadastroAgenda = this.formBuilder.group({
      id: [null],
      data_ini: [null],
      data_fim: [null],
      funcionario_agendamento: [null],
      cliente_id: [null],
      funcionario_id: [null],
      procedimento: [null],
      observacao: [null],
      status: [null],
      is_concluido: [null]
    })
  }
 
  visible: boolean = false;
  eventInfoVisible: boolean = false;
  currentEventInfo: any;
  dayjs = dayjs
  showDialog(data_ini, data_fim) {
      this.formularioCadastroAgenda.reset()
      this.formularioCadastroAgenda.get('data_ini').setValue(this.dayjs(data_ini).format('DD/MM/YYYY HH:mm:ss'))
      this.formularioCadastroAgenda.get('data_fim').setValue(this.dayjs(data_fim).format('DD/MM/YYYY HH:mm:ss'))
      this.visible = true;
  }
  

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'UTC-3',
    locale: 'pt-br',
    locales: [ptLocale],
    slotLabelFormat: {
      hour: '2-digit', // Formato de exibição das horas (ex: 01, 02, ..., 12)
      minute: '2-digit', // Formato de exibição dos minutos (ex: 00, 15, 30, 45)
      omitZeroMinute: false, // Define se deve omitir os minutos quando eles são zero (ex: mostrar 08:00 ou 08:30 em vez de 08)
      meridiem: 'short' // Formato de exibição do meridiano (AM/PM)
    },
    slotLabelInterval: 15,
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
      left: 'listWeek',
      center: 'title',
      right: 'prev,next,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    initialEvents: this.eventos_agenda, // alternatively, use the `events` setting to fetch from a feed
    events: this.eventos_agenda,
    weekends: true,
    editable: true,
    height:'80vh',
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    datesSet: this.handleDatesSet.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDisplay: this.handleEventsResize.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  handleDatesSet(events: DatesSetArg) {
    this.data_ini_agenda = this.dayjs(events.startStr).format('DD/MM/YYYY HH:mm:ss');
    this.data_fim_agenda = this.dayjs(events.endStr).format('DD/MM/YYYY HH:mm:ss');
    this.getDadosAgenda(this.data_ini_agenda, this.data_fim_agenda)

  }
  eventMouseEnter(info){
    
  }

  eventMouseLeave(info){

  }

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
    this.getDadosModal('')
    this.showDialog( selectInfo.startStr, selectInfo.endStr)
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

  }

  handleEventClick(clickInfo: EventClickArg) {
    this.getDadosModal(clickInfo.event.id)
    this.showDialog(clickInfo.event.startStr, clickInfo.event.endStr)
      
  }

  getDadosModal(evento_id:string){
    this.agendaService.getEvento({'evento_id': evento_id}).subscribe(
      dados => {
        if (dados.status){
          this.formularioCadastroAgenda.patchValue(dados.evento.agenda)
          this.preencherComboBox(dados.evento)
        }else{
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível carregar dados da agebda. Tente novamente e caso persista o erro, contate o suporte.')
        }
      });
  }
  handleEventsResize(event: EventApi){
    console.log(event)
  }
  
  handleEvents(events: EventApi[]) {
    
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }


  onSubmit(){
    this.agendaService.salvarAgenda(this.formularioCadastroAgenda.value).subscribe(
      dados => {
        if(dados.status){
          this.toastrService.mostrarToastrSuccess('Salvo com sucesso!')
          this.visible = false;
          this.getDadosAgenda(this.data_ini_agenda, this.data_fim_agenda)
        }else {
          this.toastrService.mostrarToastrWarning(dados.descricao ? dados.descricao : 'Erro ao salvar horario')
        }
      }, error => {
        this.toastrService.mostrarToastrDanger('Tente novamente mais tarde ou verifique sua conexão com a internet, caso o problema persista, entre em contato com o suporte!')
      }
    )
  }

  getDadosAgenda(data_ini:any, data_fim:any){
    var dados = {
      'data_ini':data_ini,
      'data_fim': data_fim
    }
    this.agendaService.getEventosAgenda(dados).subscribe(
      dados => {
        if (dados.status){
          console.log(dados.agenda)
          this.calendarOptions.update((options) => ({
            ...options,
            events: dados.agenda,
          }));
        }else{
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível carregar dados da agenda. Tente novamente e caso persista o erro, contate o suporte.')
        }
      });
  }
  
  preencherComboBox(data: any): void {
    this.lista_funcionario = data.lista_funcionarios.map(valor => ({
      value: valor.matricula,
      label: valor.nm_completo
    }))

    this.lista_clientes = data.lista_clientes.map(valor => ({
      value: valor.id,
      label: valor.nm_completo
    }))
  }
  
  
  changeStatus(){
    var data = {
      'id': this.formularioCadastroAgenda.get('id').value,
      'status': this.formularioCadastroAgenda.get('status').value,
    }

    console.log(data)
    this.agendaService.changeStatusAgenda(data).subscribe(
      dados => {
        if (dados.status){

        } else { 
          this.toastrService.mostrarToastrDanger(dados.descricao ? dados.descricao : 'Não foi possível mudar o status do evento. Tente novamente e caso persista o erro, contate o suporte.')
        }
      },
      error => {}
      
    )
  }
 
}
