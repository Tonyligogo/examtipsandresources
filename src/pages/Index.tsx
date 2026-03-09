import Footer from "@/components/Footer";
import HeroSection from "@/components/NewHero";
import TestimonialSection from "@/components/Testimonials";
import CourseCategoriesSection from "@/components/Categories";
import Navbar from "@/components/Navbar";
import FeaturedSection from "@/components/Featured";
import CTASection from "@/components/CTA";

const Index = () => {

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection/>
      <CourseCategoriesSection/>
     <FeaturedSection/>
     <CTASection/>
      <TestimonialSection/>

      <Footer />
    </div>
  );
};

export default Index;