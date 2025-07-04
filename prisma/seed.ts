import {
  PrismaClient,
  WorkspaceType,
  TaskStatus,
  TaskPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Step 1: Create user
  const user = await prisma.user.create({
    data: {
      email: "corbin.cargil@gmail.com",
      clerkUserId: "user_2mzt8zNLwO9pUSU9kUohb7Cseof",
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Step 2: Create workspaces
  const workspaceTypes = [
    {
      type: WorkspaceType.DEFAULT,
      name: "My Space",
      color: "#3B82F6",
      icon: "Croissant",
    },
    {
      type: WorkspaceType.DEVELOPMENT,
      name: "Development",
      color: "#10B981",
      icon: "Code",
    },
    {
      type: WorkspaceType.FAITH,
      name: "Faith",
      color: "#8B5CF6",
      icon: "Church",
    },
    {
      type: WorkspaceType.HEALTH,
      name: "Health",
      color: "#EF4444",
      icon: "Heart",
    },
    {
      type: WorkspaceType.FINANCE,
      name: "Finance",
      color: "#6366F1",
      icon: "DollarSign",
    },
  ];

  const workspaces = [];

  for (const ws of workspaceTypes) {
    const workspace = await prisma.workspace.create({
      data: {
        name: ws.name,
        type: ws.type,
        color: ws.color,
        icon: ws.icon,
        userId: user.id,
      },
    });

    workspaces.push(workspace);
    console.log(`Created workspace: ${workspace.name}`);
  }

  // Step 3: Create tasks for each workspace
  const taskNames = [
    [
      "Complete project setup",
      "Review documentation",
      "Schedule meeting",
      "Research competitors",
      "Set up workflow",
    ],
    [
      "Setup development environment",
      "Debug API endpoint",
      "Refactor auth module",
      "Write unit tests",
      "Deploy to staging",
    ],
    [
      "Read scripture",
      "Attend service",
      "Volunteer at event",
      "Meditation session",
      "Study group preparation",
    ],
    [
      "Plan family dinner",
      "Schedule video call",
      "Birthday shopping",
      "Book vacation",
      "Home repairs",
    ],
    [
      "Morning workout",
      "Meal prep",
      "Track progress",
      "Research new routine",
      "Rest day schedule",
    ],
    [
      "Review budget",
      "Check investments",
      "Pay bills",
      "Research tax deductions",
      "Update financial plan",
    ],
  ];

  const taskStatuses = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.BACKLOG,
    TaskStatus.COMPLETED,
    TaskStatus.TODO,
  ];

  const taskPriorities = [
    TaskPriority.HIGH,
    TaskPriority.MEDIUM,
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH,
  ];

  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    const tasks = taskNames[i];

    for (let j = 0; j < tasks.length; j++) {
      await prisma.task.create({
        data: {
          title: tasks[j],
          description: `Description for ${tasks[j]}`,
          status: taskStatuses[j],
          priority: taskPriorities[j],
          userId: user.id,
          workspaceUuid: workspace.uuid,
        },
      });
    }

    console.log(`Created 5 tasks for workspace: ${workspace.name}`);
  }

  // Step 4: Create notes for each workspace
  const noteContents = [
    {
      title: "General Notes",
      content: "Important information and reminders for my personal life.",
    },
    {
      title: "Development Notes",
      content: "Code snippets, links to documentation, and project ideas.",
    },
    {
      title: "Faith Journal",
      content: "Reflections, prayers, and spiritual insights.",
    },
    {
      title: "Family Memories",
      content: "Important dates, gift ideas, and family traditions.",
    },
    {
      title: "Fitness Log",
      content: "Workout progress, measurements, and goals.",
    },
    {
      title: "Financial Notes",
      content: "Budget updates, investment ideas, and financial goals.",
    },
  ];

  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    const note = noteContents[i];

    await prisma.note.create({
      data: {
        title: note.title,
        content: note.content,
        userId: user.id,
        workspaceUuid: workspace.uuid,
      },
    });

    console.log(`Created note for workspace: ${workspace.name}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
