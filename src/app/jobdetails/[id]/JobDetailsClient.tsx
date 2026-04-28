"use client";

import { memo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, CheckCircle2, Building2 } from "lucide-react";
import Image from "next/image";
import { type Job } from "@/lib/DatabaseTypes";
import { useI18n } from "@/context/I18nContext";

const JobApplicationModal = dynamic(
  () => import("@/components/JobApplicationModal").then((mod) => mod.JobApplicationModal),
  { ssr: false },
);

type JobDetailsClientProps = {
  initialJob: Job | null;
};

const JobDetailsClient = ({ initialJob }: JobDetailsClientProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { language } = useI18n();
  const job = initialJob;

  const labels = {
    en: {
      notFoundTitle: "404 - Job Not Found",
      notFoundDescription: "Sorry, the job you are looking for does not exist.",
      backToJobs: "Back to Jobs",
      home: "Home",
      jobs: "Jobs",
      apply: "Apply",
      applyNow: "Apply Now",
      description: "Description",
      responsibilities: "Responsibilities",
      whoYouAre: "Who You Are",
      niceToHaves: "Nice-to-Haves",
      aboutRole: "About this role",
      applied: "Applied",
      of: "of",
      capacity: "capacity",
      applyBefore: "Apply Before",
      jobPostedOn: "Job Posted On",
      jobType: "Job Type",
      salary: "Salary",
      categories: "Categories",
      requiredSkills: "Required Skills",
    },
    fr: {
      notFoundTitle: "404 - Emploi introuvable",
      notFoundDescription: "Desole, l'emploi que vous recherchez n'existe pas.",
      backToJobs: "Retour aux emplois",
      home: "Accueil",
      jobs: "Emplois",
      apply: "Postuler",
      applyNow: "Postuler maintenant",
      description: "Description",
      responsibilities: "Responsabilites",
      whoYouAre: "Votre profil",
      niceToHaves: "Atouts",
      aboutRole: "A propos de ce poste",
      applied: "Candidatures",
      of: "sur",
      capacity: "capacite",
      applyBefore: "Postuler avant",
      jobPostedOn: "Publie le",
      jobType: "Type d'emploi",
      salary: "Salaire",
      categories: "Categories",
      requiredSkills: "Competences requises",
    },
    ar: {
      notFoundTitle: "404 - الوظيفة غير موجودة",
      notFoundDescription: "عذرا، الوظيفة التي تبحث عنها غير موجودة.",
      backToJobs: "الرجوع الى الوظائف",
      home: "الرئيسية",
      jobs: "الوظائف",
      apply: "تقديم",
      applyNow: "قدم الان",
      description: "الوصف",
      responsibilities: "المسؤوليات",
      whoYouAre: "من انت",
      niceToHaves: "مزايا اضافية",
      aboutRole: "حول هذا الدور",
      applied: "المتقدمون",
      of: "من",
      capacity: "السعة",
      applyBefore: "اخر موعد للتقديم",
      jobPostedOn: "تاريخ نشر الوظيفة",
      jobType: "نوع الوظيفة",
      salary: "الراتب",
      categories: "الفئات",
      requiredSkills: "المهارات المطلوبة",
    },
  } as const;

  const t = labels[language] ?? labels.en;

  const handleApply = () => {
    setIsApplicationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplicationModalOpen(false);
  };

  if (!job) {
    return (
      <main
        className="container mx-auto text-center py-16"
        role="alert"
        aria-live="polite"
      >
        <h1 className="text-4xl font-bold text-destructive mb-4">
          {t.notFoundTitle}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t.notFoundDescription}
        </p>
        <Button
          asChild
          variant="default"
          size="default"
          className=""
          type="button"
        >
          <Link href="/jobs">{t.backToJobs}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto container px-4 lg:px-8 py-8">
      <nav
        className="text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center" role="list">
          <li>
            <Link href="/" className="hover:text-foreground transition">
              {t.home}
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li>
            <Link href="/jobs" className="hover:text-foreground transition">
              {t.jobs}
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li aria-current="page">
            <span className="text-foreground font-medium">{job.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {job.companyLogo && (
                  <div className="shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                      <Image
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <span>•</span>
                    <span className="font-medium text-primary">{job.type}</span>
                  </div>
                </div>

                <div className="flex gap-3 self-start shrink-0">
                  <Button
                    onClick={handleApply}
                    size="default"
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {t.apply}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">{t.responsibilities}</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {job.whoYouAre && job.whoYouAre.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">{t.whoYouAre}</h2>
                <ul className="space-y-3">
                  {job.whoYouAre.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {job.niceToHaves && job.niceToHaves.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">{t.niceToHaves}</h2>
                <ul className="space-y-3">
                  {job.niceToHaves.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">{t.aboutRole}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.applied}
                  </span>
                  <span className="text-sm font-semibold">
                    <span className="text-primary">{job.appliedCount}</span> {t.of}{" "}
                    {job.totalCapacity} {t.capacity}
                  </span>
                </div>

                <Separator className="" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.applyBefore}
                  </span>
                  <span className="text-sm font-semibold">{job.applyBefore}</span>
                </div>

                <Separator className="" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.jobPostedOn}
                  </span>
                  <span className="text-sm font-semibold">{job.jobPostedOn}</span>
                </div>

                <Separator className="" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.jobType}
                  </span>
                  <span className="text-sm font-semibold">{job.type}</span>
                </div>

                <Separator className="" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.salary}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {job.salary}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {job.categories && job.categories.length > 0 && (
            <Card className="">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{t.categories}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <Card className="">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{t.requiredSkills}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1.5 text-sm border-primary text-primary"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="lg:hidden sticky bottom-4 z-10">
            <Button
              onClick={handleApply}
              size="lg"
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 shadow-lg"
            >
              {t.applyNow}
            </Button>
          </div>
        </div>
      </div>

      {job && isApplicationModalOpen && (
        <JobApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={handleCloseModal}
          jobId={job.id}
          jobTitle={job.title}
          company={job.company}
        />
      )}
    </main>
  );
};

export default memo(JobDetailsClient);
