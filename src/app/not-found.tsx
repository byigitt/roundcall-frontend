'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-background pt-16">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="text-9xl font-bold tracking-tighter text-primary">
              404
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-[600px] space-y-4"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Oops! Looks like you've ventured into uncharted territory
            </h2>
            <p className="text-muted-foreground">
              The page you're looking for has taken a coffee break. Let's get you back on track!
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => router.back()}
              className="min-w-[150px]"
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="min-w-[150px]"
            >
              <Link href="/">
                Home Page
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="pt-8 text-sm text-muted-foreground"
          >
            <p>Need help? Contact our support team at support@roundcall.com</p>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-t from-primary/10 to-transparent"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
} 