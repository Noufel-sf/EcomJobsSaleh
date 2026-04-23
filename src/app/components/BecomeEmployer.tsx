"use client";

import Link from "next/link";
import {
	ArrowRight,
	BriefcaseBusiness,
	FileText,
	Megaphone,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Language, useI18n } from "@/context/I18nContext";

type BecomeEmployerCopy = {
	badge: string;
	title: string;
	description: string;
	points: [string, string, string];
	primaryCta: string;
	secondaryCta: string;
};

const becomeEmployerCopy: Record<Language, BecomeEmployerCopy> = {
	en: {
		badge: "Become an Employer",
		title: "Post Jobs and Build Your Team with Confidence",
		description:
			"Need great talent? Create your employer account, publish job openings, and manage applications from one streamlined space.",
		points: [
			"Publish job opportunities in minutes",
			"Receive and review candidate applications efficiently",
			"Grow your company with better hiring reach",
		],
		primaryCta: "Become Employer Here",
		secondaryCta: "Browse Jobs",
	},
	fr: {
		badge: "Devenir employeur",
		title: "Publiez vos offres et construisez votre equipe",
		description:
			"Vous cherchez des talents? Creez votre compte employeur, publiez vos offres d'emploi et gerez les candidatures depuis un espace unique.",
		points: [
			"Publiez des offres d'emploi en quelques minutes",
			"Recevez et analysez les candidatures facilement",
			"Developpez votre entreprise avec une meilleure visibilite recrutement",
		],
		primaryCta: "Devenir employeur ici",
		secondaryCta: "Voir les offres",
	},
	ar: {
		badge: "كن صاحب عمل",
		title: "انشر وظائفك وابن فريقك بثقة",
		description:
			"هل تبحث عن كفاءات؟ انشئ حساب صاحب عمل وانشر عروض التوظيف وادِر طلبات الترشح من مكان واحد.",
		points: [
			"انشر فرص العمل خلال دقائق",
			"استقبل وراجع طلبات المرشحين بسهولة",
			"وسع شركتك من خلال وصول توظيف افضل",
		],
		primaryCta: "كن صاحب عمل هنا",
		secondaryCta: "تصفح الوظائف",
	},
};

export default function BecomeEmployer() {
	const { language } = useI18n();
	const copy = becomeEmployerCopy[language];

	return (
		<section className="mb-20">
			<Card className="overflow-hidden border-primary/20 bg-linear-to-br from-background via-background to-primary/10">
				<CardContent className="p-8 lg:p-12">
					<div className="grid lg:grid-cols-2 gap-8 items-center">
						<div>
							<Badge variant="secondary" className="mb-4">
								{copy.badge}
							</Badge>
							<h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
								{copy.title}
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed mb-6">
								{copy.description}
							</p>

							<div className="flex flex-col sm:flex-row gap-3">
								<Button size="lg" asChild>
									<Link href="/new-employer">
										<BriefcaseBusiness className="w-4 h-4 mr-2" />
										{copy.primaryCta}
										<ArrowRight className="w-4 h-4 ml-2" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/jobs">{copy.secondaryCta}</Link>
								</Button>
							</div>
						</div>

						<div className="grid gap-4">
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<Megaphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[0]}</p>
							</div>
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[1]}</p>
							</div>
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[2]}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
