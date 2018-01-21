import { Component, OnInit, ElementRef, Renderer, Inject } from '@angular/core';
// Importing NgForm is not needed when creating a reactive form
// import { NgForm } from '@angular/forms';

// Import Angular Reactive Forms Building Blocks FormGroup and FormControl from angular forms
// Import FormBuilder to use it to build a formGroup with less code

// import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder,
        Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Customer } from './customer';
import 'rxjs/add/operator/debounceTime';

// import { DISABLED } from '@angular/forms';
// Custom validator using a Validator Function Factory
// Custom validator takes a max and min parameters for the rating range
function ratingRange(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): {[key: string]: boolean} | null => {
        if (c.value !== undefined &&  (isNaN(c.value) || c.value < min || c.value > max )) {
            return {'range': true};
        } else {
            return null;
        }
    };
}


 // Building a custom validator to evaluate the email and the confirmation email address
function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {

    let emailControl = c.get('email');
    console.log('emailMatcher emailCtrl value: ' + emailControl.value);

    let confirmEmailControl = c.get('confirmEmail');
    console.log('emailMatcher confirmCtrl value: ' + confirmEmailControl.value);

    console.log('emailCtrl valid: ' + emailControl.valid);
    console.log('confirmCtrl valid: ' + confirmEmailControl.valid);
    if (emailControl.pristine || confirmEmailControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmEmailControl.value) {
        return null;
    }
    if (emailControl.valid && (confirmEmailControl.dirty && confirmEmailControl.value === '')) {
        console.log('ln47 emailMatcher emptyInput: ' + true);
        let answer: {[key: string]: boolean} = {'emptyInput': true};
        return answer;
    }
    console.log('match: ' + true);
    return { 'match': true };
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    // Define the customerForm property as a class of FormGroup but use the lifecylce hook OnInit
    // to insure that the customerForm in instantiated before the page loads
    customerForm: FormGroup;
    customer: Customer= new Customer();
    counter: number;
    showMe: boolean;
    emailMessage: string;
    confirmationEmailMessage: string = '';

    private validationMessages = {
        required: 'Please enter your email address',
        pattern: 'Please enter a valid email address',
        match: 'Confirmation email does not match email address',
    };

    private confirmationValidationMessages = {
        required: 'Please enter your email address',
        pattern: 'Please enter a valid email address',
        match: 'Confirmation email does not match your email address',
        emptyInput: 'Please enter a confirmation email'
    };
    constructor(private fb: FormBuilder, @Inject(ElementRef) private element: ElementRef, private renderer: Renderer) {}

    ngOnInit(): void {

        // Reactive Forms Using FormBuilder
        this.showMe = false;
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            // Alternative Syntax for formbuilder, you can use an object with keyvalue pairs 
            // to define the controls of the lastName field
            // value is going to be n/a and the field will be disabled
            lastName: ['n/a', [Validators.required, Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', Validators.required],
            }, {validator: emailMatcher} ),
            sendCatalog: true,
            phone: '',
            notification: 'email',
            // Uses the ratingRange validator function created by the validator function factory 
            // ratingRange takes the max and min parameters
            rating: ['', ratingRange(1, 5)],
            showMe: false
        });

        // Method does the same as the setNotification method but instead of doing
        // it through event binding it uses an observable to watch the valueChanges property
        // of the notification radio button group
        this.customerForm.get('notification').valueChanges
                .subscribe(value => console.log(value));
        this.counter = 0;

        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1000).subscribe(value => this.setMessage(emailControl));

        const emailGroupControl = this.customerForm.get('emailGroup');
        const confirmationEmailControl = this.customerForm.get('emailGroup.confirmEmail');
        confirmationEmailControl.valueChanges.subscribe(value => {
                                    console.log(value);
                                    this.setConfirmationMessage(confirmationEmailControl, emailGroupControl);
                                });
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

    // experimenting with disable and enable and patchValue
    updateLastName(): void {
        if ( this.customerForm.get('firstName').touched === true) {
            let may: string = this.customerForm.get('firstName').value;
            may = may.toLowerCase();
            this.customerForm.get('lastName').enable();
            if (may === 'orville') {
                this.customerForm.patchValue({
                lastName: 'Hello Pumpkin'
            });
            this.showMe = true;
        } else {
            return;
        }
    }
 }

 // Method changes the validations dynamically at runtime on the phone input box 
 // based upon whether the user has selected the radio button email or text via event binding
 setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {

        // You can pass in an array of validators also
        phoneControl.setValidators(Validators.required);
    } else {
        phoneControl.clearValidators();
    }

        // Update Validators
    phoneControl.updateValueAndValidity();
 }

setMessage(b: AbstractControl): void {
    this.emailMessage = '';
    console.log('errors: ' + JSON.stringify(b.errors));
    if ((b.touched || b.dirty) && b.errors) {
        this.emailMessage = Object.keys(b.errors)
            .map(key => this.validationMessages[key]).join(' ');
    }
}

setConfirmationMessage(confirmCtrl: AbstractControl, emailGrpCtrl: AbstractControl): void {
    this.confirmationEmailMessage = '';

    console.log('value: ' + confirmCtrl.value);
    console.log('touched: ' + confirmCtrl.touched);
    console.log('dirty: ' + confirmCtrl.dirty);
    console.log('possible confirmationValidationMessage: ' + JSON.stringify(this.confirmationValidationMessages));
    console.log('errors: ' + JSON.stringify(emailGrpCtrl.errors));
    if ((confirmCtrl.touched || confirmCtrl.dirty) &&
        (emailGrpCtrl.errors || confirmCtrl.errors)) {
        console.log('lucky');
        Object.keys(emailGrpCtrl.errors).forEach(key => console.log('setConfirmation ln221: ' + key));
        this.confirmationEmailMessage = Object.keys(emailGrpCtrl.errors)
            .map(key => this.validationMessages[key])
            .join(' ');
            console.log('set these messages: ' + JSON.stringify(this.confirmationEmailMessage));
    }  if (emailGrpCtrl.errors && confirmCtrl.value === '') {
        console.log('hi emptyInput Ln227');
            this.confirmationEmailMessage = this.confirmationValidationMessages['emptyInput'];
    }   if (emailGrpCtrl === null) {
        console.log('bad Abstract Controller');
    }
    console.log('poop');
}

verifyErrorMessages(msg: any): void {
    let emailGrpCtrl = this.customerForm.get('emailGroup');
    if ( emailGrpCtrl.errors.emptyInput ) {
        this.confirmationEmailMessage = 'Got a chance';
    }
    console.log('Verification Method Ln233: <br/>');
    console.log(JSON.stringify(msg));
}




}
