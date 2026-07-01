import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { SelectedList } from "@/components/SelectedList";
import { EmptyState } from "@/components/EmptyState";
import { useSelectedProfiles } from "@/store/selectedProfiles";

export function SelectedListPage() {
  const count = useSelectedProfiles((s) => s.profiles.length);

  return (
    <Layout title="My List">
      <PageHeader
        title="My"
        accent="Influencer List"
        subtitle={
          count > 0
            ? `${count} profile${count !== 1 ? "s" : ""} curated — drag to reorder or remove anytime.`
            : "Start adding influencers from the search page to build your shortlist."
        }
      />

      {count === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Your list is empty"
          description="Search for influencers and click Add to List to start curating your shortlist."
          action={
            <Link to="/" className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search influencers
            </Link>
          }
        />
      ) : (
        <SelectedList compact={false} />
      )}
    </Layout>
  );
}