import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type AffirmationWithFavorite, Category } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateAffirmation,
  useCustomAffirmations,
  useDeleteAffirmation,
  useUpdateAffirmation,
} from "../hooks/useQueries";

const categoryOptions = [
  { value: Category.confidence, label: "Confidence" },
  { value: Category.gratitude, label: "Gratitude" },
  { value: Category.health, label: "Health" },
  { value: Category.love, label: "Love" },
  { value: Category.success, label: "Success" },
  { value: Category.mindfulness, label: "Mindfulness" },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3"];

function EditRow({
  item,
  onDone,
}: {
  item: AffirmationWithFavorite;
  onDone: () => void;
}) {
  const [text, setText] = useState(item.affirmation.text);
  const { mutate: update, isPending } = useUpdateAffirmation();

  const handleSave = () => {
    if (!text.trim()) return;
    update(
      { id: item.affirmation.id, text: text.trim() },
      { onSuccess: onDone },
    );
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 min-h-0 h-20 text-sm resize-none"
        data-ocid="create.textarea"
      />
      <div className="flex flex-col gap-1">
        <Button
          size="icon"
          className="h-8 w-8 bg-primary text-primary-foreground"
          onClick={handleSave}
          disabled={isPending || !text.trim()}
          data-ocid="create.save_button"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={onDone}
          data-ocid="create.cancel_button"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function CreatePage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>(Category.confidence);
  const [editingId, setEditingId] = useState<bigint | null>(null);

  const { data: customAffirmations, isLoading } = useCustomAffirmations();
  const { mutate: create, isPending: isCreating } = useCreateAffirmation();
  const { mutate: deleteAff } = useDeleteAffirmation();

  const handleCreate = () => {
    if (!text.trim()) return;
    create(
      { text: text.trim(), category },
      {
        onSuccess: () => {
          setText("");
          setCategory(Category.confidence);
        },
      },
    );
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
          data-ocid="create.modal"
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Sign in to create affirmations
          </h2>
          <p className="text-muted-foreground mb-6">
            Create personalized affirmations that truly speak to your goals and
            values.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="create.primary_button"
          >
            {isLoggingIn ? "Connecting..." : "Sign In"}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create Affirmations
          </h1>
          <p className="text-muted-foreground mb-8">
            Write your own personal affirmations.
          </p>

          {/* Create form */}
          <div
            className="bg-white rounded-2xl p-6 shadow-card mb-10"
            data-ocid="create.panel"
          >
            <h2 className="text-lg font-semibold mb-4">New Affirmation</h2>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="affirmation-text"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Affirmation Text
                </Label>
                <Textarea
                  id="affirmation-text"
                  placeholder="I am worthy of love, success, and all the goodness life has to offer..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="resize-none h-28"
                  data-ocid="create.textarea"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Category)}
                >
                  <SelectTrigger className="w-full" data-ocid="create.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !text.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 gap-2"
                data-ocid="create.submit_button"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isCreating ? "Creating..." : "Create Affirmation"}
              </Button>
            </div>
          </div>

          {/* Custom affirmations list */}
          <h2 className="text-xl font-bold mb-4">Your Custom Affirmations</h2>
          {isLoading ? (
            <div className="space-y-3" data-ocid="create.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : !customAffirmations?.length ? (
            <div
              className="text-center py-12 bg-muted/30 rounded-2xl"
              data-ocid="create.empty_state"
            >
              <p className="text-muted-foreground">
                You haven't created any affirmations yet.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {customAffirmations.map((item, i) => (
                  <motion.div
                    key={Number(item.affirmation.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 shadow-card"
                    data-ocid={`create.item.${i + 1}`}
                  >
                    {editingId === item.affirmation.id ? (
                      <EditRow item={item} onDone={() => setEditingId(null)} />
                    ) : (
                      <div className="flex gap-3 items-start">
                        <p className="flex-1 text-sm font-medium leading-relaxed">
                          &ldquo;{item.affirmation.text}&rdquo;
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingId(item.affirmation.id)}
                            data-ocid={`create.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-destructive"
                                data-ocid={`create.delete_button.${i + 1}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="create.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete affirmation?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This affirmation will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="create.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAff(item.affirmation.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  data-ocid="create.confirm_button"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground capitalize">
                        {item.affirmation.category as unknown as string}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </main>
  );
}
