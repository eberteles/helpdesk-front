import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

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

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

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
  
  update(): void {
    this.addPerfil();
    console.log(this.cliente);
    this.service.update(this.cliente).subscribe( () => {
      this.toast.success('Cliente atualizado com sucesso', 'Atualização');
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

  addPerfil(): void {
    this.cliente.perfis = [];
    if( this.perfis.get('admin').value ) {
      this.cliente.perfis.push('0');
    }
    if( this.perfis.get('cliente').value ) {
      this.cliente.perfis.push('1');
    }
    if( this.perfis.get('tecnico').value ) {
      this.cliente.perfis.push('2');
    }
  }
  
  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
  }

}
