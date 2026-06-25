import type { WindowKey } from "#constants/types";
import { useWindowActions } from "#store/window";

type WindowControlsProps = {
  target: WindowKey;
};

const WindowControls = ({ target }: WindowControlsProps) => {
  const { closeWindow } = useWindowActions();

  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div className="minimize" onClick={() => closeWindow(target)} />
      <div className="maximize" onClick={() => closeWindow(target)} />
    </div>
  );
};

export default WindowControls;
