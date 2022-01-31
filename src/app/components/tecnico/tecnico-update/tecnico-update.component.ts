import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  perfis: FormGroup;

  tecnico: Tecnico = {
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
    private service:  TecnicoService,
    private toast:    ToastrService,
    private router:   Router,
    private route:    ActivatedRoute,
    private builder:  FormBuilder
  ) {
    this.perfis = this.builder.group( {
      admin: false,
      cliente: false,
      tecnico: true
    } )
  }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe( resposta =>{
      this.tecnico  = resposta;
      this.tecnico.perfis.forEach( perfil => this.setPerfil(perfil) );
      console.log(this.perfis);
    } )
  }
  
  update(): void {
    this.addPerfil();
    console.log(this.tecnico);
    this.service.update(this.tecnico).subscribe( () => {
      this.toast.success('Técnico atualizado com sucesso', 'Atualização');
      this.router.navigate(['tecnicos']);
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
    this.tecnico.perfis = [];
    if( this.perfis.get('admin').value ) {
      this.tecnico.perfis.push('0');
    }
    if( this.perfis.get('cliente').value ) {
      this.tecnico.perfis.push('1');
    }
    if( this.perfis.get('tecnico').value ) {
      this.tecnico.perfis.push('2');
    }
  }
  
  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
  }

}
