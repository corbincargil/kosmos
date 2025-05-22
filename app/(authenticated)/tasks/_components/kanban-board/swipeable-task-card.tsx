import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Task, TaskStatusConfig } from "@/types/task";
import { Workspace } from "@/types/workspace";
import dayjs from "dayjs";
import { Flag, ChevronRight, ChevronLeft } from "lucide-react";
import { getPreviousStatus } from "@/app/(authenticated)/tasks/_components/task-list/utils";
import { TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/app/(authenticated)/_components/layout/sidebar/constants";

type SwipeableTaskCardProps = {
  task: Task & {
    taskType?: {
      autoId: number;
      name: string;
      color: string;
      icon: string;
    } | null;
    tags?: {
      tag: {
        autoId: number;
        name: string;
        color: string;
      };
    }[];
  };
  workspace: Workspace;
  onQuickMove?: () => void;
  onUpdateStatus?: (status: TaskStatus) => void;
  onEdit?: () => void;
  showStatus?: boolean;
  showQuickMove?: boolean;
  onQuickMoveBack?: () => void;
  showQuickMoveBack?: boolean;
};

const stripHtmlTags = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent;
};

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  workspace,
  onQuickMove,
  onUpdateStatus,
  onEdit,
  showStatus = true,
  showQuickMove,
  onQuickMoveBack,
  showQuickMoveBack,
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

  const handleStatusUpdate = (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    if (isLeftSwiped || isRightSwiped) {
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(100);
        }
      } catch (e) {
        console.error(e);
      }

      // Reset swipe state immediately for better UX
      setOffset(0);
      setIsLeftSwiped(false);
      setIsRightSwiped(false);

      // Trigger the status update
      onUpdateStatus?.(newStatus);
    }
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;

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
    const clipPercentage = Math.min(100, (absOffset / 60) * 100);

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
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(100);
        }
      } catch (e) {
        console.error(e);
      }

      // Reset swipe state immediately for better UX
      setOffset(0);
      setIsLeftSwiped(false);

      // Trigger the status update
      onUpdateStatus?.(newStatus);
    }
  };

  return (
    <div
      {...handlers}
      className="relative w-full rounded-lg overflow-hidden mx-auto hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out group"
      onClick={isRightSwiped || isLeftSwiped ? undefined : onEdit}
      style={{
        touchAction: "pan-y",
        minHeight: task.description ? "96px" : "68px",
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
        {task.status === TaskStatus.TODO ? (
          <div className="w-[80px] flex flex-row">
            {/* In Progress option */}
            <div
              className={`flex-1 flex flex-col items-center justify-center px-2 text-white ${getSwipeBackgroundColor(
                "right",
                "IN_PROGRESS"
              )}`}
              onClick={(e) => handleStatusUpdate(e, "IN_PROGRESS")}
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
              onClick={(e) => handleStatusUpdate(e, "COMPLETED")}
            >
              <p className="text-sm">Mark</p>
              <p className="text-sm">Completed</p>
            </div>
          </div>
        ) : task.status === TaskStatus.IN_PROGRESS ? (
          // Completed option for IN_PROGRESS tasks
          <div
            className={`max-w-[140px] flex-1 flex flex-col items-center justify-center px-2 text-white ${getSwipeBackgroundColor(
              "right",
              "COMPLETED"
            )}`}
            onClick={(e) => handleStatusUpdate(e, "COMPLETED")}
          >
            <p className="text-sm"> Mark</p>
            <p className="text-sm">Completed</p>
          </div>
        ) : null}
      </div>

      <div
        className="absolute inset-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm transition-all overflow-hidden"
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
          minHeight: task.description ? "96px" : "68px",
        }}
      >
        <div className="absolute inset-0 p-3 flex flex-col h-full">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow min-w-0">
              <div className="flex items-start gap-2">
                {task.taskType && (
                  <div className="flex-shrink-0 mt-0.5">
                    {ICON_MAP[task.taskType.icon] && 
                      React.createElement(ICON_MAP[task.taskType.icon], {
                        size: 14,
                        className: "text-gray-500 dark:text-gray-400"
                      })
                    }
                  </div>
                )}
                <h3
                  className={`text-sm font-medium line-clamp-1 ${
                    isCompleted
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {task.title}
                </h3>
                {task.priority && (
                  <Flag
                    size={14}
                    className={`flex-shrink-0 mt-0.5 ${getPriorityColor(
                      task.priority
                    )}`}
                    fill="currentColor"
                  />
                )}
              </div>
              {task.description && (
                <p
                  className={`mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 ${
                    isCompleted ? "line-through" : ""
                  }`}
                >
                  {stripHtmlTags(task.description)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {showStatus && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    TaskStatusConfig[task.status].backgroundColor,
                    TaskStatusConfig[task.status].color
                  )}
                >
                  {TaskStatusConfig[task.status].label}
                </span>
              )}
            </div>
          </div>

          <div className="flex-grow" />

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <p
                className="text-xs font-medium"
                style={{ color: workspace?.color }}
              >
                {workspace?.name}
              </p>
              {task.dueDate && (
                <p
                  className={`text-xs text-gray-400 dark:text-gray-500 ${
                    isCompleted ? "line-through" : ""
                  }`}
                >
                  Due {dayjs(task.dueDate).format("MMM D")}
                </p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-1">
              {showQuickMoveBack && onQuickMoveBack && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickMoveBack();
                  }}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Move to previous status"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
              {showQuickMove && onQuickMove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickMove();
                  }}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Move to next status"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>
          {/* todo: fix this garbâge */}
          {task.tags && task.tags.length > 0 && (
            <div className="absolute bottom-2 right-3 flex flex-wrap gap-1 justify-end">
              {task.tags.map((t) => {
                if (typeof t !== 'object' || t === null) return null;
                const tagObj = t as Record<string, any>;
                const tag = tagObj.tag ? tagObj.tag : tagObj;
                if (!tag || typeof tag !== 'object') return null;
                if (!('autoId' in tag && 'name' in tag && 'color' in tag)) return null;
                return (
                  <span
                    key={tag.autoId}
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
