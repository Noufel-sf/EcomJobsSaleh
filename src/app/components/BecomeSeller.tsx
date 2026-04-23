"use client";

import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Store, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Language, useI18n } from "@/context/I18nContext";

type BecomeSellerCopy = {
	badge: string;
	title: string;
	description: string;
	points: [string, string, string];
	primaryCta: string;
	secondaryCta: string;
};

const becomeSellerCopy: Record<Language, BecomeSellerCopy> = {
	en: {
		badge: "Become a Seller",
		title: "Open Your Store and Start Selling Today",
		description:
			"Turn your products into a thriving online business. Create your store, add your catalog, and reach customers across Algeria.",
		points: [
			"Create your own professional storefront in minutes",
			"Manage products, orders, and shipping from one dashboard",
			"Grow faster with trusted marketplace visibility",
		],
		primaryCta: "Become Seller Here",
		secondaryCta: "Explore Products",
	},
	fr: {
		badge: "Devenir vendeur",
		title: "Lancez votre boutique et commencez a vendre",
		description:
			"Transformez vos produits en activite en ligne performante. Creez votre boutique, ajoutez votre catalogue et atteignez des clients dans toute l'Algerie.",
		points: [
			"Creez votre vitrine professionnelle en quelques minutes",
			"Gerez produits, commandes et livraison depuis un seul tableau de bord",
			"Accellerez votre croissance grace a la visibilite de la marketplace",
		],
		primaryCta: "Devenir vendeur ici",
		secondaryCta: "Voir les produits",
	},
	ar: {
		badge: "كن بائعا",
		title: "افتح متجرك وابدا البيع اليوم",
		description:
			"حول منتجاتك الى مشروع ناجح عبر الانترنت. انشئ متجرك واضف منتجاتك واصل الى العملاء في كل ولايات الجزائر.",
		points: [
			"انشئ واجهة متجر احترافية خلال دقائق",
			"ادارة المنتجات والطلبات والشحن من لوحة واحدة",
			"نم بشكل اسرع من خلال الظهور داخل المنصة",
		],
		primaryCta: "كن بائعا هنا",
		secondaryCta: "تصفح المنتجات",
	},
};

export default function BecomeSeller() {
	const { language } = useI18n();
	const copy = becomeSellerCopy[language];

	return (
		<section className="mb-20">
			<Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/10 via-background to-background">
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
									<Link href="/new-seller">
										<Store className="w-4 h-4 mr-2" />
										{copy.primaryCta}
										<ArrowRight className="w-4 h-4 ml-2" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/products">{copy.secondaryCta}</Link>
								</Button>
							</div>
						</div>

						<div className="grid gap-4">
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[0]}</p>
							</div>
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[1]}</p>
							</div>
							<div className="rounded-xl border bg-background/80 p-4 flex gap-3 items-start">
								<TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
								<p>{copy.points[2]}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
