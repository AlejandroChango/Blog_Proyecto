import { TestBed } from '@angular/core/testing';

import { miblogService } from './miblog.service';

describe('miblogService', () => {
  let service: miblogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(miblogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
