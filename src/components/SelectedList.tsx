import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import { Avatar } from "./Avatar";
import { formatCount } from "@/utils/formatters";
import type { UserProfileSummary, Platform } from "@/types";
import { PlatformIcon } from "./PlatformIcon";

function getPlatform(profile: UserProfileSummary): Platform {
  if (profile.platform) return profile.platform;
  const url = profile.url || "";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube.com")) return "youtube";
  if (url.includes("tiktok.com")) return "tiktok";
  return "instagram";
}

// ── Sortable item ──────────────────────────────────────────
interface SortableItemProps {
  profile: UserProfileSummary;
  onRemove: (username: string) => void;
}

function SortableItem({ profile, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: profile.username });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
        isDragging
          ? "border-purple-300 dark:border-purple-600 shadow-xl scale-[1.02]"
          : "border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-6 h-10 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors shrink-0"
        aria-label={`Reorder ${profile.username}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 14a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 22a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      <div className="relative shrink-0">
        <Avatar src={profile.picture} alt={profile.fullname} size="sm" />
        <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-center">
          <PlatformIcon platform={getPlatform(profile)} className="w-3 h-3" />
        </div>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
          @{profile.username}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {profile.fullname}
        </div>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">
        {formatCount(profile.followers)} followers
      </div>

      <button
        onClick={() => onRemove(profile.username)}
        className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 cursor-pointer"
        aria-label={`Remove ${profile.username} from list`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

// ── Main SelectedList ──────────────────────────────────────
interface SelectedListProps {
  /** When true, shows as inline preview (on search page). When false, shows full list. */
  compact?: boolean;
}

export function SelectedList({ compact = true }: SelectedListProps) {
  const { profiles, removeProfile, reorderProfiles, clear } =
    useSelectedProfiles();
  const [expanded, setExpanded] = useState(!compact);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = profiles.findIndex((p) => p.username === active.id);
      const newIndex = profiles.findIndex((p) => p.username === over.id);

      const reordered = [...profiles];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      reorderProfiles(reordered);
    },
    [profiles, reorderProfiles]
  );

  if (profiles.length === 0) return null;

  const displayProfiles = compact && !expanded ? profiles.slice(0, 3) : profiles;

  return (
    <div className="mt-10 mb-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          aria-expanded={expanded}
          aria-controls="selected-profiles-list"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" aria-hidden="true" />
            Selected Profiles
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold text-white bg-purple-500 rounded-full">
              {profiles.length}
            </span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={clear}
          className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors cursor-pointer"
          aria-label="Clear all selected profiles"
        >
          Clear All
        </button>
      </div>

      {/* List */}
      {expanded && (
        <div id="selected-profiles-list" className="max-w-2xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayProfiles.map((p) => p.username)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {displayProfiles.map((profile) => (
                  <SortableItem
                    key={profile.username}
                    profile={profile}
                    onRemove={removeProfile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {compact && profiles.length > 3 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-3 w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors cursor-pointer"
            >
              View all {profiles.length} profiles →
            </button>
          )}
        </div>
      )}
    </div>
  );
}