import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";

import { Subscription } from "rxjs";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from "@angular/forms";
import { Ingredient } from "../../shared/ingredient.model";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.action";
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select("shoppingList")
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
    // this.subscription = this.slService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editItemIndex = index;
    //     this.editMode = true;
    //     this.editItem = this.slService.getIngredient(index);
    //     this.slForm.setValue({
    //       name: this.editItem.name,
    //       amount: this.editItem.amount,
    //     });
    //   }
    // );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editItemIndex, newIngredient);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onDelete() {
    // this.slService.deleteIngredient(this.editItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredients());

    this.onClear();
  }
}
