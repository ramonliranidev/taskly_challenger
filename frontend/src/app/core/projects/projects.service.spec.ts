import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Project } from './project.models';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let http: HttpTestingController;

  const project = (overrides: Partial<Project> = {}): Project => ({
    id: 1,
    name: 'Website redesign',
    tasks_count: 0,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads projects and activates the first one', () => {
    service.load().subscribe();

    const req = http.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush({ projects: [project({ id: 1 }), project({ id: 2 })] });

    expect(service.projects().length).toBe(2);
    expect(service.activeProjectId()).toBe(1);
    expect(service.activeProject()?.id).toBe(1);
  });

  it('does not override an already-active project on reload', () => {
    service.selectProject(2);

    service.load().subscribe();
    http.expectOne(`${environment.apiUrl}/projects`).flush({
      projects: [project({ id: 1 }), project({ id: 2 })],
    });

    expect(service.activeProjectId()).toBe(2);
  });

  it('creates a project, appends it and activates it', () => {
    service.create('App mobile').subscribe();

    const req = http.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'App mobile' });
    req.flush({ project: project({ id: 9, name: 'App mobile' }) });

    expect(service.projects().some((p) => p.id === 9)).toBe(true);
    expect(service.activeProjectId()).toBe(9);
  });

  it('renames a project in place', () => {
    service.load().subscribe();
    http.expectOne(`${environment.apiUrl}/projects`).flush({ projects: [project({ id: 1 })] });

    service.rename(1, 'Novo nome').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/projects/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ project: project({ id: 1, name: 'Novo nome' }) });

    expect(service.projects()[0].name).toBe('Novo nome');
  });

  it('removes a project and re-activates the first remaining one', () => {
    service.load().subscribe();
    http.expectOne(`${environment.apiUrl}/projects`).flush({
      projects: [project({ id: 1 }), project({ id: 2 })],
    });

    service.remove(1).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/projects/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(service.projects().map((p) => p.id)).toEqual([2]);
    expect(service.activeProjectId()).toBe(2);
  });

  it('clears the active project when the last one is removed', () => {
    service.load().subscribe();
    http.expectOne(`${environment.apiUrl}/projects`).flush({ projects: [project({ id: 1 })] });

    service.remove(1).subscribe();
    http
      .expectOne(`${environment.apiUrl}/projects/1`)
      .flush(null, { status: 204, statusText: 'No Content' });

    expect(service.projects()).toEqual([]);
    expect(service.activeProjectId()).toBeNull();
  });

  it('keeps the active project when a different one is removed', () => {
    service.load().subscribe();
    http.expectOne(`${environment.apiUrl}/projects`).flush({
      projects: [project({ id: 1 }), project({ id: 2 })],
    });

    service.remove(2).subscribe();
    http
      .expectOne(`${environment.apiUrl}/projects/2`)
      .flush(null, { status: 204, statusText: 'No Content' });

    expect(service.activeProjectId()).toBe(1);
  });
});
