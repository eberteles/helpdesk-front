import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {

  selected = '2';

  chamado: Chamado = {
    prioridade: '',
    status: '0',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: ''
  }

  tecnicos: Tecnico[] = [];
  clientes: Cliente[] = [];

  titulo:       FormControl = new FormControl(null, Validators.minLength(3));
  prioridade:   FormControl = new FormControl(null, Validators.required);
  tecnico:      FormControl = new FormControl(null, Validators.required);
  cliente:      FormControl = new FormControl(null, Validators.required);
  observacoes:  FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private service:        ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private toast:          ToastrService,
    private router:         Router,
    private route:          ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
    this.findAllTecnicos();
    this.findAllClientes();
  }

  findById(): void {
    this.service.findById(this.chamado.id).subscribe( resposta =>{
      this.chamado  = resposta;
      this.chamado.prioridade = this.chamado.prioridade.toString();
      this.chamado.cliente    = this.chamado.cliente.toString();
      this.chamado.tecnico    = this.chamado.tecnico.toString();
      console.log(this.chamado);
    } )
  }

  update(): void {
    console.log(this.chamado);
    this.service.update(this.chamado).subscribe( () => {
      this.toast.success('Chamado atualizado com sucesso', 'Alteração');
      this.router.navigate(['chamados']);
    }, ex=> {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    } );
  }

  findAllTecnicos():void {
    this.tecnicoService.findAll().subscribe( resposta => {
      this.tecnicos = resposta;
    })
  }

  findAllClientes():void {
    this.clienteService.findAll().subscribe( resposta => {
      this.clientes = resposta;
    })
  }

  validaCampos(): boolean {
    return this.titulo.valid && this.prioridade.valid && this.cliente.valid && this.tecnico.valid && this.observacoes.valid
  }

}
