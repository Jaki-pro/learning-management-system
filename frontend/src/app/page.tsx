"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Rocket, Star } from "lucide-react";
import Button from "../../components/ui/Button"; 
import ReviewSection from "../../components/Reviews";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const {role} = useAuth();
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* === HERO SECTION === */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 md:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Empower Your Mind with <span className="text-primary">Learnora</span>
        </motion.h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Build skills that last a lifetime. From beginner to expert—our structured,
          mentor-led courses are crafted to transform your learning journey.
        </p>
        <div className="mt-8 flex gap-4">
          <Button onClick={()=>router.push('/courses')} className="px-6 py-3 text-lg">Explore Courses</Button>
          {!role&&<Button  onClick={()=>router.push('/login')} className="px-3 py-1 text-lg button">
            Join Now
          </Button>}
        </div>
      </section>

      {/* === CURRENT COURSES === */}
      <section className="py-16 px-6 md:px-16 bg-muted/30 rounded-3xl mx-4 md:mx-16">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold">Current Courses</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "React for Beginners", desc: "Master React with hands-on projects." },
            { title: "Next.js Full Stack Bootcamp", desc: "Build scalable web apps like a pro." },
            { title: "Database Design & SQL", desc: "Learn data modeling and real-world queries." },
          ].map((course, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-muted-foreground mb-4">{course.desc}</p>
              <Button variant="secondary" className="w-full">
                View Details
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === UPCOMING COURSES === */}
      <section className="py-16 px-6 md:px-16">
        <div className="flex items-center gap-2 mb-8">
          <Rocket className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold">Upcoming Courses</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Advanced TypeScript Mastery",
            "AI & Machine Learning for Developers",
            "UI/UX Design Essentials",
          ].map((title, i) => (
            <div
              key={i}
              className="p-6 border border-border rounded-2xl bg-card hover:bg-muted/50 transition"
            >
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">
                Coming soon — pre-register to get early access and bonuses!
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === STUDENT REVIEWS SECTION === */}
      <section className="py-20 px-6 md:px-16 bg-muted/20 relative overflow-hidden">
        <div className="text-center mb-12">
          <Star className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Student Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from learners who transformed their careers through Learnora’s world-class courses.
          </p>
        </div>

        <ReviewSection/>

        {/* subtle gradient edges for style */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </section>

      {/* === MOTIVATION / CTA === */}
      <section className="py-20 px-6 md:px-16 text-center bg-primary/10 backdrop-blur-md">
        <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">
          Your Journey Starts <span className="text-primary">Today</span>
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
          Don&apos;t wait for the right time—create it. Start learning, growing, and shaping your
          future with the power of knowledge.
        </p>
        <Button className="px-8 py-3 text-lg button">Get Started Now</Button>
      </section>

      {/* === FOOTER === */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Learnora — Built for modern learners.
      </footer>
    </main>
  );
}
