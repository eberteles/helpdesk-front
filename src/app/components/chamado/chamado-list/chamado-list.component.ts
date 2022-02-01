import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  ELEMENT_DATA: Chamado[] = [];

  displayedColumns: string[] = ['id', 'titulo', 'dataAbertura', 'cliente', 'tecnico', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: ChamadoService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe( resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Chamado>(resposta);
      this.dataSource.paginator = this.paginator;
    } )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  retornaStatus(status: any): string {
    switch(status) {
      case 0: return 'ABERTO';
      case 1: return 'EM ANDAMENTO';
      default: return 'ENCERRADO';
    }
  }

  retornaPrioridade(prioridade: any): string {
    switch(prioridade) {
      case 0: return 'BAIXA';
      case 1: return 'MÉDIA';
      default: return 'ALTA';
    }
  }

  filterByStatus(status: any): void{
    let list: Chamado[] = [];
    this.ELEMENT_DATA.forEach(element => {
      if(element.status == status) 
        list.push(element);
    })
    this.dataSource = new MatTableDataSource<Chamado>(list);
    this.dataSource.paginator = this.paginator;
  }

}