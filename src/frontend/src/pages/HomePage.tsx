import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Heart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Category } from "../backend.d";
import { useDailyAffirmation } from "../hooks/useQueries";

const categories = [
  {
    key: Category.confidence,
    label: "Confidence",
    description: "Build self-belief and step into your power every single day.",
    icon: "⚡",
    cardClass: "card-confidence",
  },
  {
    key: Category.gratitude,
    label: "Gratitude",
    description:
      "Cultivate thankfulness and attract more abundance into your life.",
    icon: "🙏",
    cardClass: "card-gratitude",
  },
  {
    key: Category.health,
    label: "Health",
    description: "Affirm vitality, strength, and holistic well-being daily.",
    icon: "💚",
    cardClass: "card-health",
  },
  {
    key: Category.love,
    label: "Love",
    description: "Open your heart to deeper connections and self-compassion.",
    icon: "❤️",
    cardClass: "card-love",
  },
  {
    key: Category.success,
    label: "Success",
    description: "Align your mindset with achievement, focus, and excellence.",
    icon: "🏆",
    cardClass: "card-success",
  },
  {
    key: Category.mindfulness,
    label: "Mindfulness",
    description: "Find presence, peace, and clarity in every moment.",
    icon: "🧘",
    cardClass: "card-mindfulness",
  },
];

const features = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Daily Affirmation",
    description:
      "Start each day with a powerful, curated affirmation delivered just for you.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Favorites",
    description:
      "Save the affirmations that resonate most and revisit them whenever you need.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Custom Affirmations",
    description:
      "Write and personalize your own affirmations for a truly unique practice.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Categories",
    description:
      "Explore affirmations by topic — confidence, love, success, and more.",
  },
];

const testimonials = [
  {
    initials: "SM",
    name: "Sarah M.",
    role: "Yoga Instructor",
    quote:
      "Affirm has completely transformed my morning routine. I start every day feeling grounded and empowered. The daily affirmations feel personal and deeply motivating.",
    color: "bg-teal-200 text-teal-800",
  },
  {
    initials: "JL",
    name: "James L.",
    role: "Entrepreneur",
    quote:
      "As a business owner, mindset is everything. The success and confidence categories have given me affirmations I come back to over and over again.",
    color: "bg-amber-200 text-amber-800",
  },
  {
    initials: "AP",
    name: "Aisha P.",
    role: "Student",
    quote:
      "I love being able to create my own affirmations. Having something that's truly mine makes the practice so much more meaningful and powerful.",
    color: "bg-rose-200 text-rose-800",
  },
];

const avatarColors = ["bg-teal-200", "bg-amber-200", "bg-rose-200"];

export function HomePage() {
  const { data: dailyAffirmation } = useDailyAffirmation();

  return (
    <main>
      {/* Hero */}
      <section className="relative hero-gradient min-h-[85vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-teal-100 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                Daily Affirmations for a Better You
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-foreground">
                Discover Your <span className="text-primary">Daily</span>{" "}
                Affirmations
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Build a powerful mindset with personalized, meaningful
                affirmations across confidence, gratitude, love, success, and
                more.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/explore" search={{ category: undefined }}>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 gap-2"
                    data-ocid="hero.primary_button"
                  >
                    Explore Affirmations
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-primary/30 text-primary hover:bg-teal-50"
                    data-ocid="hero.secondary_button"
                  >
                    Create Your Own
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Daily affirmation card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm">
                {/* Decorative blobs */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal-200/50 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-amber-200/50 blur-2xl" />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative bg-white rounded-3xl p-8 shadow-card-hover"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                      Today's Affirmation
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-foreground leading-relaxed">
                    &ldquo;
                    {dailyAffirmation?.affirmation.text ??
                      "I am confident, capable, and worthy of all the good that comes my way."}
                    &rdquo;
                  </p>
                  {dailyAffirmation && (
                    <div className="mt-4">
                      <span className="inline-block bg-teal-100 text-primary text-xs font-medium px-3 py-1 rounded-full capitalize">
                        {
                          dailyAffirmation.affirmation
                            .category as unknown as string
                        }
                      </span>
                    </div>
                  )}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {avatarColors.map((c) => (
                        <div
                          key={c}
                          className={`w-7 h-7 rounded-full ${c} border-2 border-white`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      1,000+ daily readers
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Explore Affirmations by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find the affirmations that speak to your heart and goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                data-ocid={`categories.item.${i + 1}`}
              >
                <Link to="/explore" search={{ category: cat.key as string }}>
                  <div
                    className={`${cat.cardClass} rounded-2xl p-6 h-full hover:scale-[1.02] transition-transform cursor-pointer group`}
                  >
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <span className="text-sm font-semibold text-foreground/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                      View More <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-teal-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to build a meaningful daily affirmation
              practice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-card text-center"
                data-ocid={`features.item.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-primary flex items-center justify-center mx-auto mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: "oklch(0.96 0.02 80)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground">
              Real stories from people transforming their mindset.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-card"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
