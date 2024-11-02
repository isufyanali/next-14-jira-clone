"use client";

import { useCallback } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DottedSeparator } from "@/components/dotted-separator";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";
import { useBulkUpdateTask } from "../api/use-bulk-udpate-tasks";
import { DataCalendar } from "./data-calendar";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean
}

export const TaskViewSwitcher = ({
  hideProjectFilter
}: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTask()

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate
  });

  const onKanbanChange = useCallback((
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => {
    bulkUpdate({
      json: { tasks }
    })
  }, [])

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter}/>
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent className="mt-0" value="kanban">
              <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange}/>
            </TabsContent>
            <TabsContent className="mt-0 h-full pb-4" value="calender">
              <DataCalendar data={tasks?.documents ?? []}/>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
