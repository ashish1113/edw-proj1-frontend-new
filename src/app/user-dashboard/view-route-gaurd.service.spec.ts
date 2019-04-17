import { TestBed } from '@angular/core/testing';

import { ViewRouteGaurdService } from './view-route-gaurd.service';

describe('ViewRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewRouteGaurdService = TestBed.get(ViewRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
