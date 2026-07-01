import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SelectedList } from "@/components/SelectedList";
import { EmptyState } from "@/components/EmptyState";
import { useSelectedProfiles } from "@/store/selectedProfiles";

export function SelectedListPage() {
  const count = useSelectedProfiles((s) => s.profiles.length);

  return (
    <Layout title="My List">
      <div className="animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Influencer List
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {count > 0
              ? `${count} profile${count !== 1 ? "s" : ""} selected — drag to reorder`
              : "Start adding influencers from the search page"}
          </p>
        </div>

        {count === 0 ? (
          <EmptyState
            icon="📋"
            title="Your list is empty"
            description="Search for influencers and click 'Add to List' to start building your curated list."
            action={
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Influencers
              </Link>
            }
          />
        ) : (
          <SelectedList compact={false} />
        )}
      </div>
    </Layout>
  );
}
