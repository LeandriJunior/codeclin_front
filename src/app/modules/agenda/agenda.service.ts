import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';
import { environment } from 'src/environments/environment';

 
@Injectable({
    providedIn: 'root'
})
@Injectable()
export class AgendaService {
    
    constructor(
        private http:HttpClient,
        private headerService:HeaderService
    ) {}

    private readonly API_BACK = `${environment.API_BACK}`;
    
    getEventosAgenda(dados) {
        return this.http.get<any>(`${this.API_BACK}clinica/agenda/home`, {
            headers: this.headerService.getHeader(),
            params: dados
          });
    }

    getEvento(dados){
        return this.http.get<any>(`${this.API_BACK}clinica/agenda/evento`, {
            headers: this.headerService.getHeader(),
            params: dados
          });
    }

    filtrarPesquisa(data){
        return this.http.get<any>(`${this.API_BACK}core/funcionario/pesquisar`, {
            headers: this.headerService.getHeader(),
            params: {'pesquisa': data}
          });
    }

    salvarAgenda(data){
        return this.http.post<any>(`${this.API_BACK}clinica/agenda/evento`, data, {
            headers: this.headerService.getHeader(),
        })
    }
    changeStatusAgenda(data: { id: string; status: boolean; }) {
        return this.http.post<any>(`${this.API_BACK}clinica/agenda/evento/status`, data, {
            headers: this.headerService.getHeader(),
        })
    }
}