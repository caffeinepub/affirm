import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export function useDailyAffirmation() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dailyAffirmation"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyAffirmation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAffirmationsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["affirmationsByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getAllByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useAllAffirmations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allAffirmations"],
    queryFn: async () => {
      if (!actor) return [];
      const categories = Object.values(Category);
      const results = await Promise.all(
        categories.map((cat) => actor.getAllByCategory(cat as Category)),
      );
      return results.flat();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomAffirmations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customAffirmations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomAffirmations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (affirmationId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleFavorite(affirmationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["allAffirmations"] });
      queryClient.invalidateQueries({ queryKey: ["affirmationsByCategory"] });
    },
    onError: () => {
      toast.error("Failed to update favorite");
    },
  });
}

export function useCreateAffirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      category,
    }: { text: string; category: Category }) => {
      if (!actor) throw new Error("Not connected");
      return actor.create(text, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customAffirmations"] });
      toast.success("Affirmation created!");
    },
    onError: () => {
      toast.error("Failed to create affirmation");
    },
  });
}

export function useUpdateAffirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }: { id: bigint; text: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.update(id, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customAffirmations"] });
      toast.success("Affirmation updated!");
    },
    onError: () => {
      toast.error("Failed to update affirmation");
    },
  });
}

export function useDeleteAffirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.delete_(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customAffirmations"] });
      toast.success("Affirmation deleted");
    },
    onError: () => {
      toast.error("Failed to delete affirmation");
    },
  });
}
