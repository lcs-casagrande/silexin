export type Role =
  | "executive"
  | "project_manager"
  | "department_lead"
  | "contributor"
  | "administrator";
export type Status = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";
export type ProjectStatus = "planned" | "in_progress" | "completed";
export interface Person {
  id: string;
  name: string;
  departmentId: string;
  role: Role;
  active: boolean;
}
export interface Department {
  id: string;
  name: string;
  active: boolean;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  ownerId: string;
  participants: string[];
  status: ProjectStatus;
  priority: Priority;
  due: string;
}
export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  assigneeId: string;
  status: Status;
  priority: Priority;
  due: string;
}
export interface Event {
  id: string;
  at: string;
  actorId: string;
  projectId: string | null;
  action: string;
  detail: string;
}
export interface State {
  schema: 1;
  departments: Department[];
  people: Person[];
  projects: Project[];
  tasks: Task[];
  events: Event[];
}
export const roles: Record<Role, string> = {
  executive: "Gestor executivo",
  project_manager: "Gerente de projetos",
  department_lead: "Líder de departamento",
  contributor: "Colaborador",
  administrator: "Administrador",
};
export const statuses: Record<Status, string> = {
  todo: "A fazer",
  in_progress: "Em andamento",
  done: "Concluída",
};
export const projectStatuses: Record<ProjectStatus, string> = {
  planned: "Planejado",
  in_progress: "Em andamento",
  completed: "Concluído",
};
export const priorities: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};
export function dateOffset(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export const today = () => dateOffset(0);
export const formatDate = (s: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${s}T12:00:00`),
  );
export const overdue = (due: string, completed: boolean) =>
  !completed && due < today();
export function progress(p: Project, tasks: Task[]) {
  const all = tasks.filter((t) => t.projectId === p.id);
  const leaves = all.filter(
    (t) => !all.some((child) => child.parentId === t.id),
  );
  const done = leaves.filter((t) => t.status === "done").length;
  return {
    done,
    total: leaves.length,
    value: leaves.length ? (done / leaves.length) * 100 : null,
  };
}
export function initialState(): State {
  const departments: Department[] = [
    { id: "d1", name: "Operações (demo)", active: true },
    { id: "d2", name: "Tecnologia (demo)", active: true },
    { id: "d3", name: "Pessoas (demo)", active: true },
  ];
  const people: Person[] = [
    {
      id: "u1",
      name: "Marina Demo",
      departmentId: "d1",
      role: "project_manager",
      active: true,
    },
    {
      id: "u2",
      name: "Rafael Demo",
      departmentId: "d2",
      role: "department_lead",
      active: true,
    },
    {
      id: "u3",
      name: "Ana Demo",
      departmentId: "d1",
      role: "contributor",
      active: true,
    },
    {
      id: "u4",
      name: "Alex Demo",
      departmentId: "d3",
      role: "administrator",
      active: true,
    },
    {
      id: "u5",
      name: "João Demo",
      departmentId: "d1",
      role: "executive",
      active: true,
    },
    {
      id: "u6",
      name: "Bia Demo",
      departmentId: "d2",
      role: "contributor",
      active: true,
    },
  ];
  const projects: Project[] = [
    {
      id: "p1",
      name: "Padronização de processos",
      description:
        "Organizar os fluxos internos e construir uma base de trabalho compartilhada.",
      departmentId: "d1",
      ownerId: "u1",
      participants: ["u1", "u3", "u2"],
      status: "in_progress",
      priority: "high",
      due: dateOffset(12),
    },
    {
      id: "p2",
      name: "Portal de serviços internos",
      description:
        "Simplificar o acesso aos serviços e informações da organização.",
      departmentId: "d2",
      ownerId: "u1",
      participants: ["u1", "u2", "u6"],
      status: "in_progress",
      priority: "high",
      due: dateOffset(-2),
    },
    {
      id: "p3",
      name: "Jornada de integração",
      description:
        "Uma experiência mais clara e acolhedora para novos integrantes.",
      departmentId: "d3",
      ownerId: "u1",
      participants: ["u1", "u3"],
      status: "in_progress",
      priority: "medium",
      due: dateOffset(21),
    },
    {
      id: "p4",
      name: "Inventário de ativos",
      description:
        "Mapear equipamentos e estabelecer responsáveis por cada ativo.",
      departmentId: "d1",
      ownerId: "u1",
      participants: ["u1", "u3"],
      status: "planned",
      priority: "low",
      due: dateOffset(35),
    },
    {
      id: "p5",
      name: "Revisão da documentação",
      description:
        "Revisar e consolidar documentos de referência para a equipe.",
      departmentId: "d2",
      ownerId: "u2",
      participants: ["u2", "u6"],
      status: "completed",
      priority: "medium",
      due: dateOffset(-8),
    },
  ];
  const tasks: Task[] = [
    {
      id: "t1",
      projectId: "p1",
      parentId: null,
      title: "Mapear processos atuais",
      assigneeId: "u3",
      status: "done",
      priority: "high",
      due: dateOffset(-5),
    },
    {
      id: "t2",
      projectId: "p1",
      parentId: null,
      title: "Construir guia de procedimentos",
      assigneeId: "u1",
      status: "in_progress",
      priority: "high",
      due: dateOffset(6),
    },
    {
      id: "t3",
      projectId: "p1",
      parentId: "t2",
      title: "Documentar fluxo de solicitações",
      assigneeId: "u3",
      status: "done",
      priority: "medium",
      due: dateOffset(-1),
    },
    {
      id: "t4",
      projectId: "p1",
      parentId: "t2",
      title: "Validar responsabilidades",
      assigneeId: "u2",
      status: "done",
      priority: "high",
      due: dateOffset(2),
    },
    {
      id: "t5",
      projectId: "p1",
      parentId: "t2",
      title: "Revisar versão final do guia",
      assigneeId: "u1",
      status: "todo",
      priority: "medium",
      due: dateOffset(5),
    },
    {
      id: "t6",
      projectId: "p2",
      parentId: null,
      title: "Desenhar navegação do portal",
      assigneeId: "u6",
      status: "done",
      priority: "high",
      due: dateOffset(-6),
    },
    {
      id: "t7",
      projectId: "p2",
      parentId: null,
      title: "Validar catálogo de serviços",
      assigneeId: "u2",
      status: "in_progress",
      priority: "high",
      due: dateOffset(-3),
    },
    {
      id: "t8",
      projectId: "p2",
      parentId: null,
      title: "Organizar conteúdo de apoio",
      assigneeId: "u6",
      status: "todo",
      priority: "medium",
      due: dateOffset(2),
    },
    {
      id: "t9",
      projectId: "p3",
      parentId: null,
      title: "Definir etapas da jornada",
      assigneeId: "u1",
      status: "done",
      priority: "medium",
      due: dateOffset(-4),
    },
    {
      id: "t10",
      projectId: "p3",
      parentId: null,
      title: "Preparar material de boas-vindas",
      assigneeId: "u3",
      status: "in_progress",
      priority: "medium",
      due: dateOffset(8),
    },
    {
      id: "t11",
      projectId: "p3",
      parentId: null,
      title: "Revisar roteiro com a equipe",
      assigneeId: "u1",
      status: "todo",
      priority: "low",
      due: dateOffset(16),
    },
    {
      id: "t12",
      projectId: "p4",
      parentId: null,
      title: "Definir categorias de ativos",
      assigneeId: "u3",
      status: "todo",
      priority: "low",
      due: dateOffset(15),
    },
    {
      id: "t13",
      projectId: "p4",
      parentId: null,
      title: "Preparar formulário de inventário",
      assigneeId: "u1",
      status: "todo",
      priority: "medium",
      due: dateOffset(20),
    },
    {
      id: "t14",
      projectId: "p5",
      parentId: null,
      title: "Consolidar documentos revisados",
      assigneeId: "u6",
      status: "done",
      priority: "medium",
      due: dateOffset(-9),
    },
  ];
  return {
    schema: 1,
    departments,
    people,
    projects,
    tasks,
    events: [
      {
        id: "e1",
        at: new Date().toISOString(),
        actorId: "u1",
        projectId: "p1",
        action: "Demonstração iniciada",
        detail:
          "Dados fictícios carregados. Nenhum dado empresarial ou credencial é utilizado.",
      },
    ],
  };
}
export const STORAGE_KEY = "terra.demo.v1";
export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      if (
        s.schema === 1 &&
        [s.departments, s.people, s.projects, s.tasks, s.events].every(
          Array.isArray,
        ) &&
        s.people.some((p) => p.id === "u1")
      )
        return s;
    }
  } catch {
    /* Storage disabled or incompatible demo state: fresh synthetic data. */
  }
  return initialState();
}
