import { useEffect, useState } from "react";
import slider1 from "@/assets/slider-1.jpg";
import slider2 from "@/assets/slider-2.jpg";
import slider3 from "@/assets/slider-3.jpg";

const IMAGES = [slider1, slider2, slider3];

/** 3D rotating carousel used as a decorative background behind the hero. */
export function HeroSlider3D() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % IMAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const n = IMAGES.length;
  const step = 360 / n;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="hero3d-scene">
        <div
          className="hero3d-carousel"
          style={{ transform: `translateZ(-380px) rotateY(${-i * step}deg)` }}
        >
          {IMAGES.map((src, idx) => (
            <div
              key={idx}
              className="hero3d-face"
              style={{ transform: `rotateY(${idx * step}deg) translateZ(380px)` }}
            >
              <img
                src={src}
                alt=""
                aria-hidden="true"
                width={720}
                height={720}
                className="h-full w-full rounded-3xl object-cover shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
