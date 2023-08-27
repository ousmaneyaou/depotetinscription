import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBachelier } from '../bachelier.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bachelier-detail',
  templateUrl: './bachelier-detail.component.html',
})
export class BachelierDetailComponent implements OnInit {
  bachelier: IBachelier | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bachelier }) => {
      this.bachelier = bachelier;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
