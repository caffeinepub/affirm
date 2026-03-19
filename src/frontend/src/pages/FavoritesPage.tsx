import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Heart, Lock } from "lucide-react";
import { motion } from "motion/react";
import { AffirmationCard } from "../components/AffirmationCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useFavorites } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export function FavoritesPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data, isLoading } = useFavorites();

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
          data-ocid="favorites.modal"
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Sign in to view your favorites
          </h2>
          <p className="text-muted-foreground mb-6">
            Your saved affirmations are waiting for you. Sign in to access them
            anytime.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="favorites.primary_button"
          >
            {isLoggingIn ? "Connecting..." : "Sign In"}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground">
              Affirmations you've saved to your collection.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="favorites.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="text-center py-20" data-ocid="favorites.empty_state">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save the affirmations that resonate with you.
            </p>
            <Link to="/explore" search={{ category: undefined }}>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                data-ocid="favorites.secondary_button"
              >
                Explore Affirmations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item, i) => (
              <AffirmationCard
                key={Number(item.affirmation.id)}
                item={item}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
