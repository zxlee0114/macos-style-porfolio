import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
} as const;

const renderText = (text: string, className?: string, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      data-animation="wave"
      className={className}
      style={
        {
          "--weight": baseWeight,
          fontVariationSettings: "'wght' var(--weight)",
        } as CSSProperties
      }
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (
  container: HTMLSpanElement,
  type: keyof typeof FONT_WEIGHTS,
): (() => void) => {
  if (!container) return () => {}; // 因為清理函式期望能回傳一個函式使用

  const letters = container.querySelectorAll<HTMLSpanElement>(
    "[data-animation='wave']",
  );
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (
    letter: HTMLSpanElement,
    weight: number,
    duration = 0.25,
  ): gsap.core.Tween => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      "--weight": weight,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 20000);

      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, base, 0.3));
  };

  const controller = new AbortController();

  container.addEventListener("mousemove", handleMouseMove, {
    signal: controller.signal,
  });
  container.addEventListener("mouseleave", handleMouseLeave, {
    signal: controller.signal,
  });

  return () => {
    controller.abort();
  };
};

const Welcome = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const titleAnimationCleanup = setupTextHover(titleRef.current, "title");
    const subtitleAnimationCleanup = setupTextHover(
      subtitleRef.current,
      "subtitle",
    );

    return () => {
      titleAnimationCleanup();
      subtitleAnimationCleanup();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {renderText(
          "Hey, I'm Leon! Wecome to my",
          "text-3xl font-georama",
          100,
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText("portfolio", "text-9xl italic font-georama")}
      </h1>

      <div className="small-screen">
        <p>This Portfolio is designed for desktop/tabled screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
