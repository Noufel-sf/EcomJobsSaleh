import { Job } from "../DatabaseTypes";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp Solutions",
    companyLogo: "",
    location: "San Francisco, CA",
    type: "Full-Time",
    experience: "5+ years",
    salary: "$120,000 - $160,000",
    description: `We are looking for a talented Senior React Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using React and modern JavaScript technologies.

As a Senior React Developer, you will work closely with our product and design teams to create seamless user experiences. You'll have the opportunity to mentor junior developers and contribute to architectural decisions.

This is a full-time position with competitive salary, comprehensive benefits, and the opportunity to work on cutting-edge projects.`,
    responsibilities: [
      "Design and develop responsive web applications using React.js",
      "Collaborate with cross-functional teams to define and implement new features",
      "Write clean, maintainable, and well-documented code",
      "Conduct code reviews and mentor junior developers",
      "Optimize application performance and user experience",
      "Stay up-to-date with the latest React ecosystem trends and best practices",
    ],
    whoYouAre: [
      "5+ years of professional experience in React development",
      "Strong proficiency in JavaScript, TypeScript, HTML, and CSS",
      "Experience with state management libraries (Redux, Zustand, or similar)",
      "Familiarity with modern build tools and CI/CD pipelines",
      "Excellent problem-solving and communication skills",
      "Bachelor's degree in Computer Science or related field (or equivalent experience)",
    ],
    niceToHaves: [
      "Experience with Next.js or other React frameworks",
      "Knowledge of GraphQL and REST API design",
      "Familiarity with testing frameworks like Jest and React Testing Library",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Open source contributions or side projects",
    ],
    categories: ["Engineering", "Frontend", "Web Development"],
    requiredSkills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Redux"],
    appliedCount: 45,
    totalCapacity: 100,
    applyBefore: "April 15, 2026",
    jobPostedOn: "March 1, 2026",
  },

];

// Helper function to get a job by ID
export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find((job) => job.id === id);
};

// Helper function to get all jobs with optional filtering
export const getAllJobs = (filters?: {
  type?: string;
  location?: string;
  category?: string;
}): Job[] => {
  let filteredJobs = [...mockJobs];

  if (filters?.type) {
    filteredJobs = filteredJobs.filter(
      (job) => job.type.toLowerCase() === filters.type?.toLowerCase()
    );
  }

  if (filters?.location) {
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(filters.location?.toLowerCase() || "")
    );
  }

  if (filters?.category) {
    filteredJobs = filteredJobs.filter((job) =>
      job.categories.some(
        (cat) => cat.toLowerCase() === filters.category?.toLowerCase()
      )
    );
  }

  return filteredJobs;
};
