import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// We are no longer using the template driven forms module 
// import { FormsModule } from '@angular/forms';

// We are now using the reactive forms directives located in the ReactiveFormsModule
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';

@NgModule({
  imports: [
    BrowserModule,
  // import ReactiveFormsModule instead of the FormsModule
  // FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    CustomerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
