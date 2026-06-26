import clsx from "clsx";
import { Search } from "lucide-react";

import { WindowControls } from "#components";
import type { FileItem, Location } from "#constants/types";
import WindowWrapper from "#hoc/WindowWrapper";
import { useActiveLocation, useLocationActions } from "#store/location";
import { locations } from "#constants";
import { useWindowActions } from "#store/window";

const Finder = () => {
  const activeLocation = useActiveLocation();
  const { setActiveLocation } = useLocationActions();
  const { openWindow } = useWindowActions();

  const renderList = (name: string, items: (Location | FileItem)[]) => (
    <div>
      <h3>{name}</h3>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item as Location)}
            className={clsx(
              item.id === activeLocation?.id ? "active" : "not-active",
            )}
          >
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  const openItem = (item: FileItem) => {
    const { fileType, kind, href } = item;

    if (fileType === "pdf") return openWindow("resume");
    if (kind === "folder") return setActiveLocation(item as Location);
    if (["fig", "url"].includes(fileType || "") && href)
      return window.open(href, "_blank");
    if (fileType === "img" || fileType === "txt")
      return openWindow(`${fileType}${kind}`, item);

    return console.warn("Not supported fileType");
  };
  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("My Projects", locations.work.children)}
        </div>

        <ul className="content">
          {activeLocation?.children.map((item) => (
            <li
              key={item.id}
              className={item.position}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
