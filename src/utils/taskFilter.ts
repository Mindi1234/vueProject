export function filterTasks(tasks: any[], search: string) {
    if (!search) return tasks;
  
    const lower = search.toLowerCase();
  
    return tasks.filter((task: any) =>
      task.title.toLowerCase().includes(lower) ||
      (task.description && task.description.toLowerCase().includes(lower))
    );
  }