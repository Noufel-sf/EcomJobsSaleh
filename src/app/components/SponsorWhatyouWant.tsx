"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  LifeBuoy,
  Mail,
  Megaphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Language, useI18n } from "@/context/I18nContext";

type SponsorSectionCopy = {
  badge: string;
  title: string;
  description: string;
  bullets: [string, string, string];
  primaryCta: string;
  secondaryCta: string;
};

const sponsorSectionCopy: Record<Language, SponsorSectionCopy> = {
  en: {
    badge: "Sponsor With Us",
    title: "Want To Sponsor Your Brand Here?",
    description:
      "You can advertise your products or jobs on our platform. Contact the website support team and we will guide you through sponsorship options.",
    bullets: [
      "Feature your brand in high-visibility sponsor placements",
      "Promote products, job offers, or campaigns quickly",
      "Get support from our team from setup to launch",
    ],
    primaryCta: "Contact Support",
    secondaryCta: "Open Help Center",
  },
  fr: {
    badge: "Sponsorisez avec nous",
    title: "Vous voulez sponsoriser votre marque ici ?",
    description:
      "Vous pouvez promouvoir vos produits ou vos offres d'emploi sur notre plateforme. Contactez le support du site et nous vous guiderons.",
    bullets: [
      "Mettez votre marque en avant dans des emplacements premium",
      "Faites la promotion de produits, d'offres d'emploi ou de campagnes",
      "Beneficiez de l'accompagnement de notre equipe de A a Z",
    ],
    primaryCta: "Contacter le support",
    secondaryCta: "Ouvrir le centre d'aide",
  },
  ar: {
    badge: "اعلن معنا",
    title: "هل تريد رعاية علامتك هنا؟",
    description:
      "يمكنك الترويج لمنتجاتك او وظائفك على منصتنا. تواصل مع دعم الموقع وسنرشدك الى خيارات الرعاية المناسبة.",
    bullets: [
      "اعرض علامتك في اماكن رعاية عالية الظهور",
      "روّج للمنتجات او الوظائف او الحملات بسرعة",
      "احصل على دعم فريقنا من البداية حتى الاطلاق",
    ],
    primaryCta: "تواصل مع الدعم",
    secondaryCta: "افتح مركز المساعدة",
  },
};

export default function SponsorWhatyouWant() {
  const { language } = useI18n();
  const copy = sponsorSectionCopy[language];

  return (
    <section className="my-16">
      <Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/10 via-background to-background">
        <CardContent className="p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                {copy.badge}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold leading-tight lg:text-4xl">
                {copy.title}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {copy.description}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/help">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    {copy.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="mailto:support@salehstore.com">
                    <Mail className="mr-2 h-4 w-4" />
                    {copy.secondaryCta}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-xl border bg-background/80 p-4">
                <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p>{copy.bullets[0]}</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border bg-background/80 p-4">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p>{copy.bullets[1]}</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border bg-background/80 p-4">
                <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p>{copy.bullets[2]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
