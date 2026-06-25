import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useWindowActions, useWindows } from "#store/window";
import type { DockApp } from "#constants/types";

const Dock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const windows = useWindows();
  const { closeWindow, openWindow } = useWindowActions();

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll<HTMLButtonElement>(".dock-icon");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width: iconWidth } =
          icon.getBoundingClientRect();
        const center = iconLeft - left + iconWidth / 2;
        const distance = Math.abs(mouseX - center);

        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();

      animateIcons(e.clientX - left);
    };

    const resetIcons = () =>
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        }),
      );

    const controller = new AbortController();

    dock.addEventListener("mousemove", handleMouseMove, {
      signal: controller.signal,
    });
    dock.addEventListener("mouseleave", resetIcons, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  });

  const toggleApp = ({ id, canOpen }: Pick<DockApp, "id" | "canOpen">) => {
    if (!canOpen) return;

    const targetWindow = windows[id];
    if (!targetWindow) {
      console.error(`Window with id ${id} does not exist`);
      return;
    }

    if (targetWindow.isOpen) {
      closeWindow(id);
    } else {
      openWindow(id);
    }
  };

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
