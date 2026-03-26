import Link from "next/link";
import { Building2, Store, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const accountTypes = [
  {
    title: "Sign up as Seller",
    description:
      "Open your own store, add products, and manage your orders from one dashboard.",
    href: "/new-seller",
    icon: Store,
  },
  {
    title: "Sign up as Employer",
    description:
      "Create your company profile, post jobs, and review applications with ease.",
    href: "/new-employer",
    icon: Building2,
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
      <section className="mx-auto w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Choose how you want to join. You will continue to the full signup
            form in the next step.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {accountTypes.map((type) => {
            const Icon = type.icon;

            return (
              <Card
                key={type.title}
                className="border-zinc-200 dark:border-zinc-800"
              >
                <CardHeader className="">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                  </div>
                  <CardTitle className="">{type.title}</CardTitle>
                  <CardDescription className="">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="">
                  <Button asChild className="w-full h-11">
                    <Link className="mt-5" href={type.href}>
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
