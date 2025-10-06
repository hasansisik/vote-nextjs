import HeroSlider from './hero-slider';
import TrendingSidebar from './trending-sidebar';

export default function HeroSection() {
  return (
    <div className="h-[500px] lg:h-[600px] my-6">
      {/* Birleşik Hero Slider */}
      <HeroSlider />
    </div>
  );
}
