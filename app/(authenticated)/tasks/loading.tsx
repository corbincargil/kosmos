import KanbanLoading from "./_components/loading/kanban-loading";
import TaskViewControlsLoading from "./_components/loading/task-view-controls-loading";

export default function TasksLoading() {
    return (
        <div className="h-full flex flex-col gap-4 p-4">
          <TaskViewControlsLoading />
          <div className="flex-1">
            <KanbanLoading />
          </div>
        </div>
      );
}
