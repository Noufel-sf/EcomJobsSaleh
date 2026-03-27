import AboutClient from "./AboutClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Saleh Store',
  description: 'Learn about Saleh Store, our mission, values, and the team behind your trusted online marketplace. Discover our commitment to quality and customer satisfaction.',
  keywords: ['about us', 'company info', 'our team', 'mission', 'values'],
  openGraph: {
    title: 'About Us - Saleh Store',
    description: 'Learn about our mission, values, and commitment to quality.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const About = () => {
  return <AboutClient />;
};

export default About;
