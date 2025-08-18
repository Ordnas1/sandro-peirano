import { Component } from '@angular/core';
import { FormInput } from '../../components/forms/form-input/form-input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  imports: [FormInput, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {
  productForm = new FormGroup({
    id: new FormControl(''),
    name : new FormControl(''),
    description: new FormControl(''),
    logo: new FormControl(''),
    releaseDate: new FormControl(new Date()),
    revisionDate: new FormControl(new Date()),
  })
}
