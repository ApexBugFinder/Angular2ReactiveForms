import { Component } from '@angular/core';
// Importing NgForm is not needed when creating a reactive form
// import { NgForm } from '@angular/forms';


import { Customer } from './customer';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent  {
    customer: Customer= new Customer();

    // Old save method used angular forms
    // save(customerForm: NgForm) {
    //     console.log(customerForm.form);
    //     console.log('Saved: ' + JSON.stringify(customerForm.value));
    // }


 }
