import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import dayjs from "dayjs";
import { Flag } from "lucide-react";
import { getPreviousStatus } from "./utils";
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
  const [isRightSwiped, setIsRightSwiped] = useState(false);
  const [isLeftSwiped, setIsLeftSwiped] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (task.status === "COMPLETED") {
        if (eventData.deltaX < 0) {
          setOffset(Math.max(eventData.deltaX, -190));
        }
        return;
      }

      // Handle other statuses
      if (task.status === "TODO") {
        // Only allow right swipes for TODO tasks
        if (eventData.deltaX > 0) {
          setOffset(Math.min(eventData.deltaX, 170));
        }
        // No else clause for left swipes - they're ignored
      } else if (task.status === "IN_PROGRESS") {
        if (eventData.deltaX > 0) {
          setOffset(Math.min(eventData.deltaX, 130));
        } else if (eventData.deltaX < 0) {
          setOffset(Math.max(eventData.deltaX, -140));
        }
      }
    },
    onSwiped: (eventData) => {
      if (eventData.deltaX > 130 && task.status === "TODO") {
        setIsRightSwiped(true);
        setOffset(170);
      } else if (eventData.deltaX > 110 && task.status === "IN_PROGRESS") {
        setIsRightSwiped(true);
        setOffset(130);
      } else if (eventData.deltaX < -140 && task.status !== "TODO") {
        // Added check for non-TODO tasks
        setIsLeftSwiped(true);
        setOffset(task.status === "IN_PROGRESS" ? -140 : -190);
      } else {
        setOffset(0);
        setIsRightSwiped(false);
        setIsLeftSwiped(false);
      }
    },
  });

  const handleStatusClick = (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    if (isRightSwiped) {
      onUpdateStatus(task.id!, newStatus);
      setOffset(0);
      setIsRightSwiped(false);
    }
  };

  const isCompleted = task.status === "COMPLETED";

  const getSwipeBackgroundColor = (
    direction: "left" | "right",
    targetStatus?: TaskStatus
  ) => {
    if (direction === "right") {
      switch (targetStatus) {
        case "IN_PROGRESS":
          return "bg-blue-500 dark:bg-blue-600";
        case "COMPLETED":
          return "bg-green-500 dark:bg-green-600";
        default:
          return "bg-gray-500 dark:bg-gray-600";
      }
    } else {
      // For left swipes
      if (targetStatus) {
        // When a specific target status is provided
        switch (targetStatus) {
          case "TODO":
            return "bg-yellow-500 dark:bg-yellow-600";
          case "IN_PROGRESS":
            return "bg-blue-500 dark:bg-blue-600";
          default:
            return "bg-gray-500 dark:bg-gray-600";
        }
      } else {
        // Existing fallback behavior
        const prevStatus = getPreviousStatus(task.status as TaskStatus);
        switch (prevStatus) {
          case "TODO":
            return "bg-yellow-500 dark:bg-yellow-600";
          case "IN_PROGRESS":
            return "bg-blue-500 dark:bg-blue-600";
          default:
            return "bg-gray-500 dark:bg-gray-600";
        }
      }
    }
  };

  const getClipPath = (direction: "left" | "right") => {
    const absOffset = Math.abs(offset);
    const clipPercentage = Math.min(100, (absOffset / 60) * 100); // Reduced from 70

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
        return "text-blue-500 dark:text-blue-400";
      case "medium":
        return "text-orange-500 dark:text-orange-400";
      case "high":
        return "text-red-500 dark:text-red-400";
      default:
        return "";
    }
  };

  const handleLeftSwipeClick = (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    if (isLeftSwiped) {
      onUpdateStatus(task.id!, newStatus);
      setOffset(0);
      setIsLeftSwiped(false);
    }
  };

  return (
    <div
      {...handlers}
      className="relative w-full rounded-md overflow-hidden mx-auto hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
      onClick={isRightSwiped || isLeftSwiped ? undefined : onEdit}
      style={{
        touchAction: "pan-y",
        minHeight: task.description ? "100px" : "72px",
      }}
    >
      {/* Left swipe action */}
      <div
        className={`absolute inset-0 flex flex-row items-center justify-end px-4 text-white`}
        style={{
          clipPath: getClipPath("left"),
          transition: offset === 0 ? "clip-path 0.2s ease-out" : "none",
        }}
      >
        {task.status === "COMPLETED" ? (
          <div className="w-[180px] flex flex-row h-full">
            <div
              className={`h-full w-[140px] flex flex-col items-center justify-center px-2 cursor-pointer ${getSwipeBackgroundColor(
                "left",
                "TODO"
              )}`}
              onClick={(e) => handleLeftSwipeClick(e, "TODO")}
            >
              <p className="text-sm">Mark</p>
              <p className="text-sm">Todo</p>
            </div>
            <div
              className={`h-full w-[140px] flex flex-col items-center justify-center px-2 cursor-pointer ${getSwipeBackgroundColor(
                "left",
                "IN_PROGRESS"
              )}`}
              onClick={(e) => handleLeftSwipeClick(e, "IN_PROGRESS")}
            >
              <p className="text-sm">Mark</p>
              <p className="text-sm">In Progress</p>
            </div>
          </div>
        ) : task.status === "IN_PROGRESS" ? (
          <div
            className={`h-full w-[140px] flex flex-col items-center justify-center px-2 cursor-pointer ${getSwipeBackgroundColor(
              "left",
              "TODO"
            )}`}
            onClick={(e) => handleLeftSwipeClick(e, "TODO")}
          >
            <p className="text-sm">Mark</p>
            <p className="text-sm">Todo</p>
          </div>
        ) : null}
      </div>

      {/* Right swipe actions */}
      <div
        className="absolute inset-0 flex"
        style={{ clipPath: getClipPath("right") }}
      >
        {task.status === "TODO" ? (
          <div className="w-[80px] flex flex-row">
            {/* In Progress option */}
            <div
              className={`flex-1 flex flex-col items-center justify-center px-2 text-white ${getSwipeBackgroundColor(
                "right",
                "IN_PROGRESS"
              )}`}
              onClick={(e) => handleStatusClick(e, "IN_PROGRESS")}
            >
              <p className="text-sm">Mark</p>
              <p className="text-sm whitespace-nowrap">In Progress</p>
            </div>

            {/* Completed option */}
            <div
              className={`flex-1 flex flex-col items-center justify-center px-2 text-white ${getSwipeBackgroundColor(
                "right",
                "COMPLETED"
              )}`}
              onClick={(e) => handleStatusClick(e, "COMPLETED")}
            >
              <p className="text-sm">Mark</p>
              <p className="text-sm">Completed</p>
            </div>
          </div>
        ) : task.status === "IN_PROGRESS" ? (
          // Completed option for IN_PROGRESS tasks
          <div
            className={`max-w-[140px] flex-1 flex flex-col items-center justify-center px-2 text-white ${getSwipeBackgroundColor(
              "right",
              "COMPLETED"
            )}`}
            onClick={(e) => handleStatusClick(e, "COMPLETED")}
          >
            <p className="text-sm"> Mark</p>
            <p className="text-sm">Completed</p>
          </div>
        ) : null}
      </div>

      <div
        className="absolute inset-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-sm transition-all hover:shadow-md overflow-hidden"
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
          minHeight: task.description ? "100px" : "72px",
        }}
      >
        <div className="absolute inset-0 p-3 pl-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-grow min-w-0 mr-2">
              <div className="flex justify-between items-center">
                <h3
                  className={`w-full text-base font-semibold line-clamp-1 ${
                    isCompleted
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-900 dark:text-gray-100"
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
              className={`text-sm text-gray-600 dark:text-gray-300 line-clamp-1 ${
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
                  className={`text-xs text-gray-500 dark:text-gray-400 ${
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
