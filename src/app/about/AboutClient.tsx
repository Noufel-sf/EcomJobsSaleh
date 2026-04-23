"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ConatactCenter from "@/components/ContactCenter";
import BecomeSeller from "@/components/BecomeSeller";
import SponsorWhatyouWant from "@/components/SponsorWhatyouWant";
import BecomeEmployer from "@/components/BecomeEmployer";
import { Globe, Mail, CheckCircle2, ArrowRight, Target } from "lucide-react";
import { aboutValues } from "@/lib/data";
import { useI18n } from "@/context/I18nContext";

const AboutClient = () => {
  const { messages } = useI18n();
  const aboutMessages = messages.about;

  return (
    <main>
      <section className="relative bg-linear-to-br from-primary/10 via-background to-primary/5 py-20 ">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              {aboutMessages.badge}
            </Badge>
            <h1 className="text-4xl  lg:text-6xl  mb-6 leading-tight">
              {aboutMessages.heroTitlePrefix}{" "}
              <span className="text-primary">
                {aboutMessages.heroTitleAccent}
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              {aboutMessages.heroDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  {aboutMessages.heroShopNow}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {aboutMessages.missionBadge}
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {aboutMessages.missionTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {aboutMessages.missionParagraph1}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {aboutMessages.missionParagraph2}
              </p>
              <ul className="space-y-3">
                {aboutMessages.missionPoints.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/about.png"
                alt="Our team"
                width={500}
                height={200}
                className=""
              />
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {aboutMessages.valuesTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {aboutMessages.valuesDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutValues.map((value, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-full ${value.color} flex items-center justify-center group-hover:scale-110 transition`}
                  >
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">
                    {aboutMessages.values[idx]?.title ?? value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aboutMessages.values[idx]?.description ??
                      value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        <BecomeSeller />

        <BecomeEmployer />

        <Separator className="my-16" />

        <SponsorWhatyouWant />

        <ConatactCenter />

        <section className="bg-linear-to-r from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-primary-foreground text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {aboutMessages.ctaTitle}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {aboutMessages.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">
                {aboutMessages.ctaStartShopping}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/help">
                <Mail className="mr-2 w-4 h-4" />
                {aboutMessages.ctaHelpCenter}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutClient;
