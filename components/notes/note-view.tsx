"use client";

import React, { useState } from "react";
import { Note } from "@/types/note";
import { NotesViewToggle } from "@/components/notes/notes-view-toggle";
import { NoteGrid } from "@/components/notes/note-grid";
import { NoteList } from "@/components/notes/note-list";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface NoteViewProps {
  notes: Note[] | undefined;
}

export function NoteView({ notes }: NoteViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultView = (searchParams.get("view") as "grid" | "list") || "grid";
  const [view, setView] = useState<"grid" | "list">(defaultView);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortCriterion, setSortCriterion] = useState("updatedAt");

  const handleViewChange = (newView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`);
    setView(newView);
  };

  const filteredAndSortedNotes = notes
    ?.filter((note) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (sortCriterion === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortCriterion === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortCriterion === "updatedAt") {
        return sortOrder === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 py-2 md:py-4">
        <div className="flex flex-col h-12 sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <Select
              onValueChange={(value) => setSortCriterion(value)}
              value={sortCriterion}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="createdAt">Sort by Created At</SelectItem>
                <SelectItem value="updatedAt">Sort by Updated At</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setSortOrder(value)}
              value={sortOrder}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full sm:w-auto justify-between">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <NotesViewToggle view={view} onViewChange={handleViewChange} />
        </div>
      </div>

      {view === "grid" ? (
        <NoteGrid notes={filteredAndSortedNotes ?? []} />
      ) : (
        <NoteList notes={filteredAndSortedNotes ?? []} />
      )}
    </div>
  );
}
