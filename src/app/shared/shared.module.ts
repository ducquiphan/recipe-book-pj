import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AlertComponent} from "./alert/alert.component";
import {PlaceholderDirective} from "./placeholder/placeholder.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    AlertComponent,
    PlaceholderDirective,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    AlertComponent,
    PlaceholderDirective,
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
})
export class SharedModule {
}
