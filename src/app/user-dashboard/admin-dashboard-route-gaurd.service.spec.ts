import { TestBed } from '@angular/core/testing';

import { AdminDashboardRouteGaurdService } from './admin-dashboard-route-gaurd.service';

describe('AdminDashboardRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDashboardRouteGaurdService = TestBed.get(AdminDashboardRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
