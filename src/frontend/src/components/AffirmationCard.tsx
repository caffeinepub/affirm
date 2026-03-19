import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { type AffirmationWithFavorite, Category } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useToggleFavorite } from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  confidence: "bg-teal-100 text-teal-700",
  gratitude: "bg-blue-100 text-blue-700",
  health: "bg-green-100 text-green-700",
  love: "bg-rose-100 text-rose-700",
  success: "bg-amber-100 text-amber-700",
  mindfulness: "bg-purple-100 text-purple-700",
};

interface Props {
  item: AffirmationWithFavorite;
  index?: number;
}

export function AffirmationCard({ item, index = 0 }: Props) {
  const { loginStatus, identity, login } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();
  const cat = item.affirmation.category as unknown as string;

  const handleFavorite = () => {
    if (!isLoggedIn) {
      toast.info("Sign in to save favorites", {
        action: { label: "Sign in", onClick: login },
      });
      return;
    }
    toggleFavorite(item.affirmation.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-4"
      data-ocid={`affirmation.item.${index + 1}`}
    >
      <p className="text-base font-medium leading-relaxed text-foreground flex-1">
        &ldquo;{item.affirmation.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <Badge
          className={`${categoryColors[cat] ?? "bg-muted text-muted-foreground"} text-xs font-medium capitalize border-0`}
        >
          {cat}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full"
          onClick={handleFavorite}
          disabled={isPending}
          data-ocid={`affirmation.toggle.${index + 1}`}
          aria-label={
            item.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              item.isFavorite
                ? "fill-rose-500 text-rose-500"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>
    </motion.div>
  );
}
