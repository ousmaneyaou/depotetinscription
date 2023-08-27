import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBachelier } from '../bachelier.model';
import { BachelierService } from '../service/bachelier.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './bachelier-delete-dialog.component.html',
})
export class BachelierDeleteDialogComponent {
  bachelier?: IBachelier;

  constructor(protected bachelierService: BachelierService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bachelierService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
