'use client';

import { useState } from "react";
import { type Language, useI18n } from "@/context/I18nContext";
import { Card, CardContent } from "@/components/ui/card";
import ContactCenter from "@/components/ContactCenter";
import { faqData } from "@/lib/data";

type FaqEntry = {
  question: string;
  answer: string;
};

type FaqByCategory = {
  general: FaqEntry[];
  shipping: FaqEntry[];
  returns: FaqEntry[];
  account: FaqEntry[];
};

const helpCopy: Record<Language, { title: string; subtitle: string; tabs: Record<keyof FaqByCategory, string> }> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find quick answers to common questions",
    tabs: {
      general: "General",
      shipping: "Shipping",
      returns: "Returns",
      account: "Account",
    },
  },
  fr: {
    title: "Questions frequentes",
    subtitle: "Trouvez rapidement des reponses aux questions courantes",
    tabs: {
      general: "General",
      shipping: "Livraison",
      returns: "Retours",
      account: "Compte",
    },
  },
  ar: {
    title: "الاسئلة الشائعة",
    subtitle: "اعثر بسرعة على اجابات للاسئلة المتكررة",
    tabs: {
      general: "عام",
      shipping: "الشحن",
      returns: "الارجاع",
      account: "الحساب",
    },
  },
};

const translatedFaqData: Record<Language, FaqByCategory> = {
  en: faqData as FaqByCategory,
  fr: {
    general: [
      {
        question: "Comment creer un compte ?",
        answer:
          "Cliquez sur le bouton d'inscription en haut a droite, remplissez vos informations et verifiez votre adresse e-mail. Votre compte sera pret immediatement.",
      },
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Une fois la commande expediee, vous recevrez un numero de suivi par e-mail. Vous pouvez aussi voir vos commandes depuis votre espace compte.",
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Nous acceptons les principales cartes bancaires, PayPal, Apple Pay, Google Pay et les virements bancaires pour les grosses commandes.",
      },
      {
        question: "Puis-je annuler ou modifier ma commande ?",
        answer:
          "Vous pouvez annuler ou modifier votre commande dans les 2 heures suivant l'achat depuis la section Mes commandes.",
      },
    ],
    shipping: [
      {
        question: "Quelles sont vos options de livraison ?",
        answer:
          "Nous proposons la livraison standard (5-7 jours), express (2-3 jours) et la livraison le lendemain selon disponibilite.",
      },
      {
        question: "Livrez-vous a l'international ?",
        answer:
          "Oui, nous livrons dans plus de 50 pays. Les delais internationaux sont generalement de 7 a 14 jours ouvrables.",
      },
      {
        question: "Mon colis est en retard, que faire ?",
        answer:
          "Verifiez d'abord le suivi. Si aucun mouvement n'apparait pendant 3 jours ou plus, contactez notre support avec votre numero de commande.",
      },
    ],
    returns: [
      {
        question: "Quelle est votre politique de retour ?",
        answer:
          "Nous proposons une politique de retour de 30 jours pour les articles non utilises dans leur emballage d'origine.",
      },
      {
        question: "Comment lancer un retour ?",
        answer:
          "Connectez-vous, ouvrez Mes commandes, selectionnez l'article puis cliquez sur Demander un retour.",
      },
      {
        question: "Quand recevrai-je mon remboursement ?",
        answer:
          "Les remboursements sont traites sous 5 a 7 jours ouvrables apres reception du retour.",
      },
    ],
    account: [
      {
        question: "Comment reinitialiser mon mot de passe ?",
        answer:
          "Cliquez sur Mot de passe oublie depuis la page de connexion et suivez le lien envoye par e-mail.",
      },
      {
        question: "Comment mettre a jour mes informations ?",
        answer:
          "Allez dans les parametres du compte, modifiez vos informations puis enregistrez les changements.",
      },
      {
        question: "Puis-je supprimer mon compte ?",
        answer:
          "Oui, depuis Parametres du compte > Confidentialite > Supprimer le compte. Cette action est definitive.",
      },
    ],
  },
  ar: {
    general: [
      {
        question: "كيف يمكنني انشاء حساب؟",
        answer:
          "اضغط على زر التسجيل في الاعلى، ثم املأ بياناتك وقم بتأكيد البريد الالكتروني. سيكون حسابك جاهزا مباشرة.",
      },
      {
        question: "كيف اتتبع طلبي؟",
        answer:
          "بعد شحن الطلب ستصلك رسالة فيها رقم التتبع، ويمكنك ايضا متابعة الطلبات من صفحة حسابك.",
      },
      {
        question: "ما وسائل الدفع المقبولة؟",
        answer:
          "نقبل بطاقات الدفع الرئيسية وPayPal وApple Pay وGoogle Pay والتحويل البنكي للطلبات الكبيرة.",
      },
      {
        question: "هل يمكنني تعديل او الغاء الطلب؟",
        answer:
          "يمكنك تعديل او الغاء الطلب خلال ساعتين من وقت الشراء من قسم طلباتي.",
      },
    ],
    shipping: [
      {
        question: "ما هي خيارات الشحن المتاحة؟",
        answer:
          "نوفر شحنا عاديا (5-7 ايام)، وشحنا سريعا (2-3 ايام)، وشحنا في اليوم التالي حسب التوفر.",
      },
      {
        question: "هل توفرون الشحن الدولي؟",
        answer:
          "نعم، نشحن لاكثر من 50 دولة، ويستغرق الشحن الدولي عادة من 7 الى 14 يوم عمل.",
      },
      {
        question: "الطرد متاخر، ماذا افعل؟",
        answer:
          "تحقق من رقم التتبع اولا. اذا لم تظهر حركة لمدة 3 ايام او اكثر، تواصل مع الدعم وارسل رقم الطلب.",
      },
    ],
    returns: [
      {
        question: "ما سياسة الارجاع لديكم؟",
        answer:
          "نقدم سياسة ارجاع لمدة 30 يوما للمنتجات غير المستخدمة وفي عبوتها الاصلية.",
      },
      {
        question: "كيف ابدأ طلب ارجاع؟",
        answer:
          "سجل الدخول، اذهب الى طلباتي، اختر المنتج ثم اضغط طلب ارجاع.",
      },
      {
        question: "متى استلم المبلغ المسترجع؟",
        answer:
          "يتم تنفيذ الاسترجاع خلال 5 الى 7 ايام عمل بعد استلام المنتج المرتجع.",
      },
    ],
    account: [
      {
        question: "كيف اعيد تعيين كلمة المرور؟",
        answer:
          "اضغط نسيت كلمة المرور في صفحة تسجيل الدخول واتبع الرابط المرسل الى بريدك.",
      },
      {
        question: "كيف احدث بيانات الحساب؟",
        answer:
          "من اعدادات الحساب، قم بتعديل بياناتك ثم احفظ التغييرات.",
      },
      {
        question: "هل يمكنني حذف حسابي؟",
        answer:
          "نعم، من اعدادات الحساب > الخصوصية > حذف الحساب. هذا الاجراء نهائي.",
      },
    ],
  },
};

const HelpClient = () => {
  const { language } = useI18n();
  const copy = helpCopy[language];
  const selectedFaqData = translatedFaqData[language];
  const [activeTab, setActiveTab] = useState<keyof FaqByCategory>("general");
  const activeQuestions = selectedFaqData[activeTab];

  return (
    <section className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{copy.title}</h2>
            <p className="text-muted-foreground">{copy.subtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid w-full grid-cols-4 mb-8 bg-muted rounded-lg p-1 gap-1">
              {(["general", "shipping", "returns", "account"] as Array<keyof FaqByCategory>).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-9 rounded-md text-sm font-medium transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {copy.tabs[tab]}
                </button>
              ))}
            </div>

            <Card className="">
              <CardContent className="p-6 space-y-3">
                {activeQuestions.map((faq, idx) => (
                  <details key={idx} className="group border-b border-border pb-3">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
                    </summary>
                    <p className="text-muted-foreground leading-relaxed mt-3">{faq.answer}</p>
                  </details>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <ContactCenter />
      </div>
    </section>
  );
};

export default HelpClient;
