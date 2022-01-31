import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent implements OnInit {

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
  
  delete(): void {
    this.service.delete(this.tecnico.id).subscribe( () => {
      this.toast.success('Técnico apagado com sucesso', 'Exclução');
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

}
