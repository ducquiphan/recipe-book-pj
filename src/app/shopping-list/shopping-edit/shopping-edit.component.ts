import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  shoppingForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  deletMode = false;
  editItemIndex: number;
  editItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.shoppingForm = new FormGroup<any>({
      'name': new FormControl('', [Validators.required]),
      'amount': new FormControl(1, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    });
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index) => {
        this.editMode = true;
        this.deletMode = true;
        this.editItemIndex = index;
        this.editItem = this.shoppingListService.getIngredient(index);
        this.shoppingForm.setValue({
          'name': this.editItem.name,
          'amount': this.editItem.amount,
        });
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const ingName = this.shoppingForm.value['name'];
    const ingAmount = this.shoppingForm.value['amount'];
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.clearForm();
  }

  deleteIng(deleteItemIndex: number) {
    this.shoppingListService.deleteIngredient(deleteItemIndex);
    this.clearForm();
  }

  clearForm() {
    this.shoppingForm.reset({
      'amount': 1,
    });
    this.editMode = false;
    this.deletMode = false;
  }

}
