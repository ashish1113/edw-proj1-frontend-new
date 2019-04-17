import { TestBed } from '@angular/core/testing';

import { AdminViewRouteGaurdService } from './admin-view-route-gaurd.service';

describe('AdminViewRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminViewRouteGaurdService = TestBed.get(AdminViewRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
