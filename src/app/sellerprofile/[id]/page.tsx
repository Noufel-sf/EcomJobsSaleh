import SellerProfileClient from "./SellerProfileClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

export const revalidate = 900;
export const dynamicParams = true;

type SellerViewModel = {
  id: string;
  storeName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  img: string;
};

type SellerProductViewModel = {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  smallDesc: string;
  available: boolean;
};

type SellerProfileData = {
  seller: SellerViewModel | null;
  products: SellerProductViewModel[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RawSellerInfo = {
  id?: string | number;
  storeName?: string;
  sellerName?: string;
  description?: string;
  sellerDescription?: string;
  email?: string;
  sellerEmail?: string;
  phoneNumber?: string | number;
  sellerPhoneNumber?: string;
  sellerAddress?: string;
  address?: string;
  img?: string;
  total_sales?: number;
  totalSales?: number;
  firstName?: string;
  lastName?: string;
  products?: RawSellerProduct[];
};

type RawSellerInfoResponse = {
  seller?: RawSellerInfo;
  user?: RawSellerInfo;
  content?: RawSellerInfo;
  data?: RawSellerInfo;
  products?: RawSellerProduct[];
};

type RawSellerProduct = {
  id?: string | number;
  name?: string;
  price?: number | string;
  mainImage?: string;
  smallDesc?: string;
  available?: boolean;
};

function normalizeSellerInfo(
  response: RawSellerInfoResponse | RawSellerInfo,
  sellerId: string,
): SellerViewModel | null {
  const source =
    (response as RawSellerInfoResponse)?.seller ??
    (response as RawSellerInfoResponse)?.user ??
    (response as RawSellerInfoResponse)?.content ??
    (response as RawSellerInfoResponse)?.data ??
    (response as RawSellerInfo);

  if (!source || typeof source !== "object") {
    return null;
  }

  const firstLast = [source.firstName, source.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    id: String(source.id ?? sellerId),
    storeName:
      source.storeName || source.sellerName || firstLast || "Seller Profile",
    description:
      source.description ||
      source.sellerDescription ||
      "No description available for this seller yet.",
    email: source.email || source.sellerEmail || "",
    phone: String(source.phoneNumber ?? source.sellerPhoneNumber ?? ""),
    address: source.sellerAddress || source.address || "Location not shared",
    img: source.img || "",
  };
}

function normalizeSellerProducts(
  response: RawSellerInfoResponse | RawSellerInfo,
): SellerProductViewModel[] {
  const source =
    (response as RawSellerInfoResponse)?.seller ??
    (response as RawSellerInfoResponse)?.user ??
    (response as RawSellerInfoResponse)?.content ??
    (response as RawSellerInfoResponse)?.data ??
    (response as RawSellerInfo);

  const products =
    (Array.isArray((response as RawSellerInfoResponse)?.products)
      ? (response as RawSellerInfoResponse).products
      : undefined) ??
    (Array.isArray(source?.products) ? source.products : []);

  return products
    .filter((product): product is RawSellerProduct => !!product)
    .map((product, index) => ({
      id: String(product.id ?? `seller-product-${index}`),
      name: product.name || "Unnamed product",
      price: Number(product.price ?? 0),
      mainImage: product.mainImage || "",
      smallDesc: product.smallDesc || "",
      available: Boolean(product.available),
    }));
}

async function fetchSellerInfoById(
  sellerId: string,
): Promise<SellerProfileData> {
  try {
    const response = await fetch(`${API_URL}/sellers/${sellerId}`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return {
        seller: null,
        products: [],
      };
    }

    const data = (await response.json()) as
      | RawSellerInfoResponse
      | RawSellerInfo;
      console.log("seller info ", data);
      

    return {
      seller: normalizeSellerInfo(data, sellerId),
      
      products: normalizeSellerProducts(data),
    };
  } catch {
    return {
      seller: null,
      products: [],
    };
  }
}

export default async function SellerProfilePage({ params }: PageProps) {
  const { id: sellerId } = await params;

  if (!sellerId) {
    return (
      <SellerProfileClient
        sellerIdMissing
        seller={null}
        sellerProducts={[]}
      />
    );
  }

  const { seller, products: sellerProducts } = await fetchSellerInfoById(sellerId);

  return (
    <SellerProfileClient
      sellerIdMissing={false}
      seller={seller}
      sellerProducts={sellerProducts}
    />
  );
}
