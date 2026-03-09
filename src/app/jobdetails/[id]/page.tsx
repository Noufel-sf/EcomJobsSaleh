"use client";

import { memo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { getJobById } from "@/lib/mockData/jobs";
import { Job } from "@/lib/DatabaseTypes";
import Image from "next/image";
import { JobApplicationModal } from "@/components/JobApplicationModal";
// import { useGetJobByIdQuery } from "@/Redux/Services/JobApi";

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Using mock data instead of API
  useEffect(() => {
    if (!id) return;
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const foundJob = getJobById(id as string);
      if (foundJob) {
        setJob(foundJob);
        setIsError(false);
      } else {
        setJob(null);
        setIsError(true);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Uncomment below to use real API instead of mock data
  // const {
  //   data: job,
  //   isLoading,
  //   isError,
  // } = useGetJobByIdQuery(id as string, {
  //   skip: !id,
  // });



  const handleApply = () => {
    setIsApplicationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplicationModalOpen(false);
  };


  if (isError) {
    return (
      <main
        className="container mx-auto text-center py-16"
        role="alert"
        aria-live="polite"
      >
        <h1 className="text-4xl font-bold text-destructive mb-4">
          404 - Job Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the job you are looking for does not exist.
        </p>
        <Button asChild variant="default" size="default" className="" type="button">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto container px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav
        className="text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center" role="list">
          <li>
            <Link href="/" className="hover:text-foreground transition">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li>
            <Link href="/jobs" className="hover:text-foreground transition">
              Jobs
            </Link>
          </li>
          <li aria-hidden="true" className="mx-2">
            /
          </li>
          <li aria-current="page">
            <span className="text-foreground font-medium">{job?.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <Card className="">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Company Logo */}
                {job?.companyLogo && (
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

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                    {job?.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job?.company}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{job?.location}</span>
                    </div>
                    <span>•</span>
                    <span className="font-medium text-primary">
                      {job?.type}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 self-start shrink-0">
                
                  <Button
                    onClick={handleApply}
                    size="default"
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {job?.description}
              </p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          {job?.responsibilities && job.responsibilities.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
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

          {/* Who You Are */}
          {job?.whoYouAre && job.whoYouAre.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">Who You Are</h2>
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

          {/* Nice to Haves */}
          {job?.niceToHaves && job.niceToHaves.length > 0 && (
            <Card className="">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-4">Nice-to-Haves</h2>
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

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* About This Role */}
          <Card className="">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">About this role</h3>

              <div className="space-y-4">
                {/* Applied Status */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Applied
                  </span>
                  <span className="text-sm font-semibold">
                    <span className="text-primary">{job?.appliedCount}</span> of{" "}
                    {job?.totalCapacity} capacity
                  </span>
                </div>

                <Separator className="" />

                {/* Apply Before */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Apply Before
                  </span>
                  <span className="text-sm font-semibold">
                    {job?.applyBefore}
                  </span>
                </div>

                <Separator className="" />

                {/* Job Posted On */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Job Posted On
                  </span>
                  <span className="text-sm font-semibold">
                    {job?.jobPostedOn}
                  </span>
                </div>

                <Separator className="" />

                {/* Job Type */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Job Type
                  </span>
                  <span className="text-sm font-semibold">{job?.type}</span>
                </div>

                <Separator className="" />

                {/* Salary */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Salary
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {job?.salary}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {job?.categories && job.categories.length > 0 && (
            <Card className="">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
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

          {/* Required Skills */}
          {job?.requiredSkills && job.requiredSkills.length > 0 && (
            <Card className="">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Required Skills</h3>
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

          {/* Apply Button - Mobile Sticky */}
          <div className="lg:hidden sticky bottom-4 z-10">
            <Button
              onClick={handleApply}
              size="lg"
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 shadow-lg"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {job && (
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

export default memo(JobDetailsPage);
