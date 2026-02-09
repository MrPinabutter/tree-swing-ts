import { chooseOption, handleUpdateOptionsMenu } from "../../core/input/menu";
import { clearScreen } from "../../core/terminal/screen";
import { hideCursor } from "../../core/terminal/cursor";
import { showMenuStart } from "../start";

const handleCreateConfig = async () => {};

const handleDeleteConfig = async () => {};

const handleGoBack = () => {
  process.stdin.removeAllListeners("data");
  showMenuStart();
};

const MENU_OPTIONS = [
  {
    id: 1,
    label: "Create new config",
    value: "create",
    action: handleCreateConfig,
  },
  {
    id: 2,
    label: "Delete config",
    value: "delete",
    action: handleDeleteConfig,
  },
  {
    id: 3,
    label: "Go back",
    value: "back",
    isGoBack: true,
    action: handleGoBack,
  },
];

const currentOption = 1;

export const showConfigManager = () => {
  clearScreen();
  hideCursor();
  process.stdin.setRawMode(true);
  process.stdin.resume();

  chooseOption(currentOption, MENU_OPTIONS);
  process.stdin.on(
    "data",
    handleUpdateOptionsMenu(currentOption, MENU_OPTIONS),
  );
};
