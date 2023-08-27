import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICampagne } from '../campagne.model';
import { CampagneService } from '../service/campagne.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './campagne-delete-dialog.component.html',
})
export class CampagneDeleteDialogComponent {
  campagne?: ICampagne;

  constructor(protected campagneService: CampagneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.campagneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
