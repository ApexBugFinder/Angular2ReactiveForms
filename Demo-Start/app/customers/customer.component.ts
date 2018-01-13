import { Component, OnInit } from '@angular/core';
// Importing NgForm is not needed when creating a reactive form
// import { NgForm } from '@angular/forms';

// Import Angular Reactive Forms Building Blocks FormGroup and FormControl from angular forms
// Import FormBuilder to use it to build a formGroup with less code
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

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
    counter: number;
    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {

        // Reactive Forms Using FormBuilder
        this.customerForm = this.fb.group({
            firstName: '',
            lastName: '',
            email: '',
            sendCatalog: true
        });
        this.counter = 0;

        // Reactive Forms Using FormGroup

        // this.customerForm = new FormGroup({
        //     // This is the Form Model not to be confused with the data model
        //     // Define form fields and pass in the default values in to the new instance of the FormControl
        //     firstName: new FormControl(),
        //     lastName: new FormControl(),
        //     email: new FormControl(),
        //     sendCatalog: new FormControl(true)

        // });
    }
    // Old save method used angular forms
    // save(customerForm: NgForm) {
    //     console.log(customerForm.form);
    //     console.log('Saved: ' + JSON.stringify(customerForm.value));
    // }
    save(): void {
        this.counter = this.counter + 1;
        console.log('Save Counter: ' + this.counter);
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));

    }
    // You can populate the form with test data using setValue and patchValue
    // setValue requires that you popluate every formControl of the formGroup (every input field of the form)
    // setValue if all the values are not populated then an error will be thrown
    // patchValue allows you to populate just a discreet set of values
    populateTestData(): void {
        this.customerForm.setValue({
            firstName: 'Jack',
            lastName: 'Jumbolaya',
            email: 'jackssnatch@gmail.com',
            sendCatalog: false
        });
        console.log('Updated: ' + JSON.stringify(this.customerForm.value));
    }
    populateTestData2(): void {
        this.customerForm.patchValue({
            firstName: 'bugger',
            lastName: 'all',
            email: this.customerForm.get('email').value
        });
        console.log('Updated: ' + JSON.stringify(this.customerForm.value));
    }

 }
