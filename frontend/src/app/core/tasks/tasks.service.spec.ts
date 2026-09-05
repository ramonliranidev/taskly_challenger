import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Project } from '../projects/project.models';
import { ProjectsService } from '../projects/projects.service';
import { Task } from './task.models';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let projects: ProjectsService;
  let http: HttpTestingController;

  const project = (id: number): Project => ({
    id,
    name: `Projeto ${id}`,
    tasks_count: 0,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  });

  const task = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    project_id: 1,
    title: 'Nova tarefa',
    short_description: null,
    full_description: null,
    due_date: null,
    status: 'not_started',
    tags: [],
    attachments: [],
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TasksService);
    projects = TestBed.inject(ProjectsService);
    http = TestBed.inject(HttpTestingController);
    TestBed.tick(); // roda o effect() inicial (projectId ainda null, sem request)
  });

  afterEach(() => http.verify());

  it('loads tasks when a project becomes active, and closes the panel', () => {
    service.openTaskPanel(999); // simula painel aberto de uma troca anterior

    projects.selectProject(1);
    TestBed.tick();

    http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [task({ id: 1 })] });

    expect(service.tasks().length).toBe(1);
    expect(service.openTaskId()).toBeNull();
  });

  it('reloads tasks and clears the previous list when switching project', () => {
    projects.selectProject(1);
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [task({ id: 1 })] });
    expect(service.tasks().length).toBe(1);

    projects.selectProject(2);
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/projects/2/tasks`).flush({ tasks: [] });

    expect(service.tasks().length).toBe(0);
  });

  it('creates a task and opens the edit panel on it', () => {
    projects.selectProject(1);
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [] });

    service.create(1).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/projects/1/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Nova tarefa' });
    req.flush({ task: task({ id: 42 }) });

    expect(service.tasks().some((t) => t.id === 42)).toBe(true);
    expect(service.openTaskId()).toBe(42);
  });

  it('debounces field updates and merges patches from the same task into a single PATCH', async () => {
    vi.useFakeTimers();
    try {
      projects.selectProject(1);
      TestBed.tick();
      http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [task({ id: 1 })] });

      service.updateFields(1, { title: 'Título editado' });
      // grava local na hora, sem disparar request ainda
      expect(service.tasks()[0].title).toBe('Título editado');
      http.expectNone(`${environment.apiUrl}/tasks/1`);

      await vi.advanceTimersByTimeAsync(200);
      service.updateFields(1, { short_description: 'Descrição editada' });
      http.expectNone(`${environment.apiUrl}/tasks/1`);

      await vi.advanceTimersByTimeAsync(500);

      const req = http.expectOne(`${environment.apiUrl}/tasks/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        title: 'Título editado',
        short_description: 'Descrição editada',
      });
      req.flush({
        task: task({ id: 1, title: 'Título editado', short_description: 'Descrição editada' }),
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('updates status immediately, without waiting for the debounce', () => {
    projects.selectProject(1);
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [task({ id: 1 })] });

    service.updateStatus(1, 'in_progress');

    const req = http.expectOne(`${environment.apiUrl}/tasks/1`);
    expect(req.request.body).toEqual({ status: 'in_progress' });
    req.flush({ task: task({ id: 1, status: 'in_progress' }) });

    expect(service.tasks()[0].status).toBe('in_progress');
  });

  it('deletes a task, removes it locally and closes the panel if it was open', () => {
    projects.selectProject(1);
    TestBed.tick();
    http.expectOne(`${environment.apiUrl}/projects/1/tasks`).flush({ tasks: [task({ id: 1 })] });
    service.openTaskPanel(1);

    service.delete(1);
    http.expectOne(`${environment.apiUrl}/tasks/1`).flush(null);

    expect(service.tasks().length).toBe(0);
    expect(service.openTaskId()).toBeNull();
  });
});
