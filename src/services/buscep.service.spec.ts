import { TestBed } from '@angular/core/testing';

import { BuscepService } from './buscep.service';

describe('BuscepService', () => {
  let service: BuscepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
