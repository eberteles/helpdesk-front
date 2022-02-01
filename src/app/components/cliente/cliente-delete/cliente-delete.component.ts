import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  perfis: FormGroup;

  cliente: Cliente = {
    id:           '',
    nome:         '',
    cpf:          '',
    email:        '',
    senha:        '',
    perfis:       [],
    dataCriacao:  '',
  }

  constructor(
    private service:  ClienteService,
    private toast:    ToastrService,
    private router:   Router,
    private route:    ActivatedRoute,
    private builder:  FormBuilder
  ) {
    this.perfis = this.builder.group( {
      admin: false,
      cliente: true,
      tecnico: false
    } )
  }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe( resposta =>{
      this.cliente  = resposta;
      this.cliente.perfis.forEach( perfil => this.setPerfil(perfil) );
      console.log(this.perfis);
    } )
  }
  
  delete(): void {
    this.service.delete(this.cliente.id).subscribe( () => {
      this.toast.success('Cliente apagado com sucesso', 'Exclução');
      this.router.navigate(['clientes']);
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

  setPerfil(perfil: String): void {
    switch(perfil) {
      case 'ADMIN':
        this.perfis.get('admin').setValue(true);
        break;
      case 'CLIENTE':
        this.perfis.get('cliente').setValue(true);
        break;
      case 'TECNICO':
        this.perfis.get('tecnico').setValue(true);
        break;
    }
  }

}
