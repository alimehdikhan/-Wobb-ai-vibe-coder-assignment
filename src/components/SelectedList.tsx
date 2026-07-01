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
      className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border transition-all duration-200 bg-[var(--surface-card)] ${
        isDragging
          ? "border-[var(--color-primary)] shadow-[var(--shadow-lg)] scale-[1.01]"
          : "border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--surface-muted)] transition-colors shrink-0"
        aria-label={`Reorder ${profile.username}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 14a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM8 22a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      <div className="relative shrink-0">
        <Avatar src={profile.picture} alt={profile.fullname} size="sm" />
        <div className="absolute -bottom-1 -right-1 p-0.5 bg-[var(--surface-card)] rounded-full border border-[var(--color-border)] flex items-center justify-center">
          <PlatformIcon platform={getPlatform(profile)} className="w-3 h-3" />
        </div>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="font-semibold text-[var(--color-text)] truncate text-sm">
          @{profile.username}
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] truncate">
          {profile.fullname}
        </div>
      </div>

      <div className="text-xs text-[var(--color-text-muted)] shrink-0 hidden sm:block tabular-nums">
        {formatCount(profile.followers)}
      </div>

      <button
        type="button"
        onClick={() => onRemove(profile.username)}
        className="btn-ghost shrink-0 p-2 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:!text-[var(--color-error)] hover:!bg-[var(--color-error-muted)]"
        aria-label={`Remove ${profile.username} from list`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

interface SelectedListProps {
  compact?: boolean;
}

export function SelectedList({ compact = true }: SelectedListProps) {
  const profiles = useSelectedProfiles((state) => state.profiles);
  const removeProfile = useSelectedProfiles((state) => state.removeProfile);
  const reorderProfiles = useSelectedProfiles((state) => state.reorderProfiles);
  const clear = useSelectedProfiles((state) => state.clear);
  const [expanded, setExpanded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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

  const isCollapsedPreview = compact && !expanded;
  const displayProfiles = isCollapsedPreview ? profiles.slice(0, 3) : profiles;

  return (
    <section
      className="mt-12 animate-slide-up"
      aria-labelledby={compact ? "selected-list-heading" : undefined}
    >
      <div className="surface-card p-4 sm:p-5 max-w-2xl mx-auto">
        <div className={`flex items-center mb-4 ${compact ? "justify-between" : "justify-end"}`}>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] hover:opacity-80 transition-opacity cursor-pointer"
              aria-expanded={expanded}
              aria-controls="selected-profiles-list"
              id="selected-list-heading"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
              Selected Profiles
              <span className="badge-count">{profiles.length}</span>
              <svg
                className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all selected profiles?")) clear();
            }}
            className="btn-danger-text"
            aria-label="Clear all selected profiles"
          >
            Clear all
          </button>
        </div>

        <div id="selected-profiles-list">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={displayProfiles.map((p) => p.username)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col gap-2 list-none p-0 m-0" aria-label="Selected influencer profiles">
                {displayProfiles.map((profile) => (
                  <li key={profile.username}>
                    <SortableItem profile={profile} onRemove={removeProfile} />
                  </li>
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          {isCollapsedPreview && profiles.length > 3 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-3 w-full text-center text-sm font-semibold text-[var(--color-primary)] py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-muted)] transition-colors cursor-pointer"
            >
              View all {profiles.length} profiles →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}