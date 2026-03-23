"use client";

import { useRef, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import JobCard from './JobCard';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAllJobsQuery } from '@/Redux/Services/JobApi';

const JobCardSkeleton = () => {
  return (
    <Card className="bg-secondary border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <div className="pt-4 border-t border-border/50 flex justify-end">
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

const JobsSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
    const { data: jobsData, isLoading } = useGetAllJobsQuery();
  const jobs = jobsData?.content || [];


  return (
    <section 
      className="py-20 bg-linear-to-b from-background to-muted/20"
      aria-labelledby="jobs-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="max-w-4xl">
            <h2 
              id="jobs-heading"
              className="text-
              2xl lg:text-3xl font-bold bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6"
            >
              Featured Opportunities
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Discover top tech jobs in Algeria. Apply now and take your career to
              the next level.
            </p>
          </div>
          <div className="flex items-center gap-3" role="group" aria-label="Job carousel navigation">
            <button 
              className="jobs-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous jobs"
              type="button"
              disabled={isLoading}
            >
              <ChevronLeft className="text-white" aria-hidden="true" />
            </button>
            <button 
              className="jobs-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next jobs"
              type="button"
              disabled={isLoading}
            >
              <ChevronRight className="text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Jobs Swiper */}
        {isLoading ? (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <JobCardSkeleton key={`job-skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={30}
            modules={[Pagination, Navigation, Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            navigation={{
              nextEl: '.jobs-next',
              prevEl: '.jobs-prev',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="mb-12"
            a11y={{
              enabled: true,
              prevSlideMessage: 'Previous job',
              nextSlideMessage: 'Next job',
            }}
          >
            {jobs.map((job) => (
              <SwiperSlide key={job.id}>
                <JobCard job={job} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link href="/jobs" className="inline-block">
          <Button 
            size="lg" 
            variant="default"
            className="bg-primary hover:bg-primary/90 transition-colors"
            aria-label="Browse all available jobs"
          >
            Browse All Jobs
            <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(JobsSection);
