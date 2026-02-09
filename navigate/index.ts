import { MENU_STATE } from "../core/input/menu";
import { hideCursor } from "../core/terminal/cursor";
import { setMenuState } from "../state";

const menuLoaders = {
  [MENU_STATE.MAIN]: () =>
    import("../menus/start").then((mod) => mod.showMenuStart()),
} as const;

export const navigateToMenu = (menu: MENU_STATE) => {
  setMenuState(menu);
  hideCursor();
  menuLoaders[menu]();
};
