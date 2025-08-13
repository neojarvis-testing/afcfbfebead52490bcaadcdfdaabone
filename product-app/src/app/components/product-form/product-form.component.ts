import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  template: `
    <div class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ product ? 'Edit' : 'Add' }} Product</h5>
            <button type="button" class="btn-close" (click)="onCancel()"></button>
          </div>
          
          <div class="modal-body">
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" formControlName="name">
                <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" 
                     class="text-danger">
                  Name is required
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" 
                          formControlName="description"></textarea>
              </div>

              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" 
                       formControlName="price" step="0.01">
                <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" 
                     class="text-danger">
                  Price must be greater than 0
                </div>
              </div>

              <div class="mb-3">
                <label for="stockQuantity" class="form-label">Stock Quantity</label>
                <input type="number" class="form-control" id="stockQuantity" 
                       formControlName="stockQuantity">
                <div *ngIf="productForm.get('stockQuantity')?.invalid && productForm.get('stockQuantity')?.touched" 
                     class="text-danger">
                  Stock quantity is required and must be at least 0
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="onCancel()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
                  {{ product ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop show"></div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1050;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.saved.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
