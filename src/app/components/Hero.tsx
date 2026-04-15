import HeroCarousel from "./HeroCarousel";
import Image from "next/image";

type HeroSponsor = {
  image?: string;
  sponsorLink?: string;
  description?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wadkniss-r6ar.onrender.com/api/v1";

async function getSponsors(): Promise<HeroSponsor[]> {
  try {
    const response = await fetch(`${API_URL}/sponsoreds`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as
      | HeroSponsor[]
      | { content?: HeroSponsor[] };

    if (Array.isArray(data)) {
      return data;
    }

    return data.content ?? [];
  } catch {
    return [];
  }
}

const Hero = async () => {
  const sponsors = await getSponsors();

  return (
    <>
      <section className="px-6 py-12 mx-auto container flex items-stretch gap-5 min-h-125">
        <HeroCarousel sponsors={sponsors} />
        <div className="hidden lg:flex max-w-[20%]  items-center cursor-pointer relative">
          <Image
            src="/sp2.png"
            alt="Sponsored advertisement"
            className="w-full h-full object-cover rounded-sm shadow-lg"
            fill
            loading="lazy"
            sizes="20vw"
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
