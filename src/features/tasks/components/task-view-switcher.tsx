"use client";

import { useQueryState } from "nuqs";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useTaskFilters } from "../hooks/use-task-filters";

import { DataTable } from "./data-table";
import { columns } from "./columns";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { DataFilters } from "./data-filters";

export const TaskViewSwitcher = () => {
  const [{
    status,
    assigneeId,
    projectId,
    dueDate
  }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const workspaceId = useWorkspaceId();
  const { 
    data: tasks, 
    isLoading: isLoadingTasks 
  } = useGetTasks({ 
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate
  });
  const { open } = useCreateTaskModal();

  return (
    <Tabs
        defaultValue={view}
        onValueChange={setView}
        className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
          <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
            <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
                Data Kanban
                {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
                Data Calendar
                {JSON.stringify(tasks)}
            </TabsContent>
            </>
        )}
      </div>
    </Tabs>
  );
};
