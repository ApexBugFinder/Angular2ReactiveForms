import { Component, OnInit } from '@angular/core';
// Importing NgForm is not needed when creating a reactive form
// import { NgForm } from '@angular/forms';

// Import Angular Reactive Forms Building Blocks FormGroup and FormControl from angular forms
import { FormControl, FormGroup } from '@angular/forms';

import { Customer } from './customer';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit  {
    // Define the customerForm property as a class of FormGroup but use the lifecylce hook OnInit
    // to insure that the customerForm in instantiated before the page loads
    customerForm: FormGroup;
    customer: Customer= new Customer();

    ngOnInit(): void {
        this.customerForm = new FormGroup({
            // This is the Form Model not to be confused with the data model
            // Define form fields and pass in the default values in to the new instance of the FormControl
            firstName: new FormControl(),
            lastName: new FormControl(),
            email: new FormControl(),
            sendCatalog: new FormControl(true)

        });
    }
    // Old save method used angular forms
    // save(customerForm: NgForm) {
    //     console.log(customerForm.form);
    //     console.log('Saved: ' + JSON.stringify(customerForm.value));
    // }


 }
