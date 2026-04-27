import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EmployerProfileByIdPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/employerprofile");
  }

  redirect(`/employerprofile?id=${encodeURIComponent(id)}`);
}
