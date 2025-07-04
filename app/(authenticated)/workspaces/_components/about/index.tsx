import React from "react";

export default function WorkspaceAbout() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground mb-4">
        About Workspaces
      </h1>
      <div className="prose prose-base max-w-none dark:prose-invert">
        <p className="text-foreground text-base leading-relaxed">
          A <strong>workspace</strong> is a focused area in Kosmos for
          organizing tasks and notes related to a major part of your life, such
          as Work, Fitness, Faith, School, Finance, or Development. Each
          workspace keeps its own tasks and notes separate, and may offer unique
          tools or pages based on its type. Workspaces help you keep what
          matters most clear and uncluttered.
        </p>

        <hr className="my-4 border-border" />

        <h3 className="text-lg font-semibold text-foreground mb-2">
          <strong>Should I Create a Workspace or Use Tags?</strong>
        </h3>

        <p className="mb-2 text-foreground text-base">
          <strong>Create a workspace if</strong>
        </p>
        <ul className="list-disc pl-4 mb-3 space-y-1 text-foreground text-base">
          <li>
            <p>
              This is a major area of your life or a long-term project (e.g.,
              Work, Fitness, Faith, School, Finance, Development).
            </p>
          </li>
          <li>
            <p>
              You want to keep its tasks and notes separate from everything
              else.
            </p>
          </li>
          <li>
            <p>
              You need special features or pages for this area (like workout
              logs for Fitness, budget tracking for Finance).
            </p>
          </li>
        </ul>

        <p className="mb-2 text-foreground text-base">
          <strong>Use tags within a workspace if</strong>
        </p>
        <ul className="list-disc pl-4 mb-3 space-y-1 text-foreground text-base">
          <li>
            <p>
              You just want to group or filter related tasks and notes (e.g.,
              &ldquo;Reading,&rdquo; &ldquo;Journaling,&rdquo;
              &ldquo;Family&rdquo; within a Personal workspace).
            </p>
          </li>
          <li>
            <p>The topic is a subcategory, not a major area.</p>
          </li>
          <li>
            <p>You don&apos;t need extra features—just simple organization.</p>
          </li>
        </ul>

        <hr className="my-4 border-border" />

        <h3 className="text-lg font-semibold text-foreground mb-2">
          <strong>Quick Questions to Help You Decide</strong>
        </h3>
        <ol className="list-decimal pl-4 mb-3 space-y-1 text-foreground text-base">
          <li>
            <p>Is this a major area of my life or a big project?</p>
          </li>
          <li>
            <p>Do I need special tools or pages for this area?</p>
          </li>
          <li>
            <p>
              Will keeping these tasks and notes separate make things simpler?
            </p>
          </li>
          <li>
            <p>
              Is this just a way to group related items within a bigger area?
            </p>
          </li>
          <li>
            <p>Would a tag give me enough organization?</p>
          </li>
        </ol>

        <hr className="my-4 border-border" />

        <div className="bg-muted border-l-4 border-primary p-3 rounded-r-lg">
          <span className="font-semibold text-foreground mb-1 text-base">
            <strong>Note:</strong>
          </span>{" "}
          <p className="text-muted-foreground text-base">
            You can&apos;t automatically convert tags to workspaces or vice
            versa, but you can always reorganize manually if your needs change.
          </p>
        </div>
      </div>
    </div>
  );
}
