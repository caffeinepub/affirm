import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category } from "../backend.d";
import { AffirmationCard } from "../components/AffirmationCard";
import {
  useAffirmationsByCategory,
  useAllAffirmations,
} from "../hooks/useQueries";

const ALL = "all";
const categoryTabs = [
  { value: ALL, label: "All" },
  { value: Category.confidence, label: "Confidence" },
  { value: Category.gratitude, label: "Gratitude" },
  { value: Category.health, label: "Health" },
  { value: Category.love, label: "Love" },
  { value: Category.success, label: "Success" },
  { value: Category.mindfulness, label: "Mindfulness" },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function CategoryAffirmations({ category }: { category: Category }) {
  const { data, isLoading } = useAffirmationsByCategory(category);
  if (isLoading) return <GridSkeleton />;
  if (!data?.length) return <Empty />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, i) => (
        <AffirmationCard
          key={Number(item.affirmation.id)}
          item={item}
          index={i}
        />
      ))}
    </div>
  );
}

function AllAffirmationsFiltered({ search }: { search: string }) {
  const { data, isLoading } = useAllAffirmations();
  if (isLoading) return <GridSkeleton />;
  const filtered = search
    ? (data ?? []).filter((item) =>
        item.affirmation.text.toLowerCase().includes(search.toLowerCase()),
      )
    : (data ?? []);
  if (!filtered.length) return <Empty search={search} />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((item, i) => (
        <AffirmationCard
          key={Number(item.affirmation.id)}
          item={item}
          index={i}
        />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-ocid="explore.loading_state"
    >
      {SKELETON_KEYS.map((k) => (
        <Skeleton key={k} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

function Empty({ search }: { search?: string }) {
  return (
    <div className="text-center py-16" data-ocid="explore.empty_state">
      <p className="text-muted-foreground">
        {search
          ? `No affirmations found for "${search}"`
          : "No affirmations in this category yet."}
      </p>
    </div>
  );
}

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState(ALL);
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Explore Affirmations
          </h1>
          <p className="text-muted-foreground">
            Browse hundreds of affirmations across every category.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search affirmations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full"
            data-ocid="explore.search_input"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList
            className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-full"
            data-ocid="explore.tab"
          >
            {categoryTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Content */}
        {activeTab === ALL ? (
          <AllAffirmationsFiltered search={search} />
        ) : (
          <CategoryAffirmations category={activeTab as Category} />
        )}
      </div>
    </main>
  );
}
