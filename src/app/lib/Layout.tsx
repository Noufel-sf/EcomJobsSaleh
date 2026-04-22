import LayoutVisibility from "./LayoutVisibility";

type Classification = {
  id: string;
  name: string;
  desc?: string;
};

type ClassificationsResponse = {
  content?: Classification[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getClassifications(): Promise<Classification[]> {
  try {
    const response = await fetch(`${API_URL}/classifications`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ClassificationsResponse;
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const classifications = await getClassifications();

  return (
    <LayoutVisibility classifications={classifications}>
      {children}
    </LayoutVisibility>
  );
}
