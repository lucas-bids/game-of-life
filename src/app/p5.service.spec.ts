import { TestBed } from '@angular/core/testing';

import { P5Service } from './p5.service';

describe('P5Service', () => {
  let service: P5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
