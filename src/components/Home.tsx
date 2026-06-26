import { locations } from "#constants";
import type { FileItem, Location } from "#constants/types";
import { useLocationActions } from "#store/location";
import { useWindowActions } from "#store/window";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { Draggable } from "gsap/Draggable";

const projects = locations.work?.children ?? [];

const Home = () => {
  const { setActiveLocation } = useLocationActions();
  const { openWindow } = useWindowActions();
  const handleOpenProjectFinder = (project: FileItem) => {
    setActiveLocation(project as Location);
    openWindow("finder");
  };

  useGSAP(() => {
    Draggable.create(".folder");
  }, []);

  return (
    <section id="home">
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => handleOpenProjectFinder(project)}
            className={clsx("group folder", project.windowPosition)}
          >
            <img src="/images/folder.png" alt={project.name} />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
