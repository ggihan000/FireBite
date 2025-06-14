import { useEffect, useState } from "react";
import CategorySelector from "../components/CategorySelector";
// import MenuItems from "../components/MenuItems";
import StepSection from "../components/StepSection";
// import { fetchMenuItems } from "../api/menuService";
import HeroSection from '../components/HeroSection';
import AboutUsSection from "../components/AboutUsSection";
import MenuSection from "../components/MenuSection";
import SpecialitySection from "../components/SpecialitySection";
import DownloadAppSection from "../components/DownloadAppSection";

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [menuItems, setMenuItems] = useState([]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const items = await fetchMenuItems(selectedCategory);
  //     setMenuItems(items);
  //   };
  //   loadData();
  // }, [selectedCategory]);

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <HeroSection />
      <AboutUsSection />
      <MenuSection />
      <StepSection />
      <SpecialitySection />
      <DownloadAppSection />
    </div>
  );
}
