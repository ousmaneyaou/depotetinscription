import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFaculte } from '../faculte.model';
import { FaculteService } from '../service/faculte.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './faculte-delete-dialog.component.html',
})
export class FaculteDeleteDialogComponent {
  faculte?: IFaculte;

  constructor(protected faculteService: FaculteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.faculteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
