import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import dayjs from "dayjs";
import { Flag } from "lucide-react";
import {
  getStatusColor,
  getSwipeText,
  getNextStatus,
  getPreviousStatus,
} from "./utils";
import { TaskStatus } from "@/types/task";

type SwipeableTaskCardProps = {
  task: Task;
  workspace: Workspace;
  onUpdateStatus: (taskId: number, newStatus: string) => void;
  onEdit: () => void;
};

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  workspace,
  onUpdateStatus,
  onEdit,
}) => {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (task.status !== "COMPLETED" && eventData.deltaX > 0) {
        setOffset(Math.min(eventData.deltaX, 200));
      } else if (task.status !== "TODO" && eventData.deltaX < 0) {
        setOffset(Math.max(eventData.deltaX, -200));
      }
    },
    onSwiped: (eventData) => {
      if (eventData.deltaX > 150) {
        const nextStatus = getNextStatus(task.status as TaskStatus);
        if (nextStatus) {
          onUpdateStatus(task.id!, nextStatus);
        }
      } else if (eventData.deltaX < -150) {
        const prevStatus = getPreviousStatus(task.status as TaskStatus);
        if (prevStatus) {
          onUpdateStatus(task.id!, prevStatus);
        }
      }
      setOffset(0);
    },
  });

  const isCompleted = task.status === "COMPLETED";

  const getSwipeBackgroundColor = (direction: "left" | "right") => {
    if (direction === "right") {
      const nextStatus = getNextStatus(task.status as TaskStatus);
      switch (nextStatus) {
        case "IN_PROGRESS":
          return "bg-blue-500";
        case "COMPLETED":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    } else {
      const prevStatus = getPreviousStatus(task.status as TaskStatus);
      switch (prevStatus) {
        case "TODO":
          return "bg-yellow-500";
        case "IN_PROGRESS":
          return "bg-blue-500";
        default:
          return "bg-gray-500";
      }
    }
  };

  const getClipPath = (direction: "left" | "right") => {
    const absOffset = Math.abs(offset);
    const clipPercentage = Math.min(100, (absOffset / 50) * 100);

    if (direction === "left") {
      return offset < 0
        ? `inset(0 ${100 - clipPercentage}% 0 0)`
        : "inset(0 100% 0 0)";
    } else {
      return offset > 0
        ? `inset(0 0 0 ${100 - clipPercentage}%)`
        : "inset(0 0 0 100%)";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "text-blue-500";
      case "medium":
        return "text-orange-500";
      case "high":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div
      {...handlers}
      className="relative w-full rounded-md overflow-hidden max-w-sm mx-auto hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
      onClick={onEdit}
      style={{
        touchAction: "pan-y",
        minHeight: task.description ? "100px" : "72px",
      }}
    >
      {/* Left swipe action */}
      <div
        className={`absolute inset-0 flex flex-col items-end justify-center px-4 text-white ${getSwipeBackgroundColor(
          "left"
        )}`}
        style={{
          clipPath: getClipPath("left"),
          transition: offset === 0 ? "clip-path 0.2s ease-out" : "none",
        }}
      >
        <p>Mark</p>
        <p>{getSwipeText(task.status as TaskStatus, "left")}</p>
      </div>

      {/* Right swipe action */}
      <div
        className={`absolute inset-0 flex flex-col items-start justify-center px-4 text-white ${getSwipeBackgroundColor(
          "right"
        )}`}
        style={{
          clipPath: getClipPath("right"),
          transition: offset === 0 ? "clip-path 0.2s ease-out" : "none",
        }}
      >
        <p>Mark</p>
        <p>{getSwipeText(task.status as TaskStatus, "right")}</p>
      </div>

      <div
        className="absolute inset-0 bg-white border rounded-md shadow-sm transition-all hover:shadow-md overflow-hidden"
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
          minHeight: task.description ? "100px" : "72px",
        }}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-${getStatusColor(
            task.status
          )}`}
        ></div>
        <div className="absolute inset-0 p-3 pl-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-grow min-w-0 mr-2">
              <div className="flex justify-between items-center">
                <h3
                  className={`w-full text-base font-semibold line-clamp-1 ${
                    isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.priority && (
                  <Flag
                    size={16}
                    className={`ml-2 ${getPriorityColor(task.priority)}`}
                    fill="currentColor"
                  />
                )}
              </div>
            </div>
          </div>
          {task.description && (
            <p
              className={`text-sm text-gray-600 line-clamp-1 ${
                isCompleted ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="flex-grow"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex-grow">
              {task.dueDate && (
                <p
                  className={`text-xs text-gray-500 ${
                    isCompleted ? "line-through" : ""
                  }`}
                >
                  Due: {dayjs(task.dueDate).format("MMM D")}
                </p>
              )}
            </div>
            <p
              className="text-xs font-medium ml-2 flex-shrink-0"
              style={{ color: workspace?.color }}
            >
              {workspace?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
