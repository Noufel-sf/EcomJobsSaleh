import ProductDetailsClient from "./ProductDetailsClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

const PRE_RENDER_ITEMS = 60;

export const revalidate = 900;
export const dynamicParams = true;

type IdRecord = {
  id?: string | number;
};

type ProductsListResponse = {
  content?: IdRecord[];
};

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const response = await fetch(
      `${API_URL}/products?page=1&size=${PRE_RENDER_ITEMS}`,
      {
        next: { revalidate },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ProductsListResponse;

    return (data.content ?? [])
      .map((product) => product.id)
      .filter((id): id is string | number => id !== undefined && id !== null)
      .map((id) => ({ id: String(id) }));
  } catch {
    return [];
  }
}

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}
