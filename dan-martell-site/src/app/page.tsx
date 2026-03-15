import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Book from "@/components/Book";
import SaasAcademy from "@/components/SaasAcademy";
import Speaking from "@/components/Speaking";
import Investing from "@/components/Investing";
import ContentHub from "@/components/ContentHub";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <Book />
      <SaasAcademy />
      <Speaking />
      <Investing />
      <ContentHub />
      <Footer />
    </main>
  );
}
