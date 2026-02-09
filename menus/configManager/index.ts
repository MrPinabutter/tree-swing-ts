import {
  chooseOption,
  handleUpdateOptionsMenu,
  initMenu,
} from "../../core/input/menu";
import { showMenuStart } from "../start";
import { showCreateConfig } from "../createConfig";
import { showDeleteConfig } from "../deleteConfig";

const handleGoBack = () => {
  process.stdin.removeAllListeners("data");
  showMenuStart();
};

const MENU_OPTIONS = [
  {
    id: 1,
    label: "Create new config",
    value: "create",
    action: showCreateConfig,
  },
  {
    id: 2,
    label: "Delete config",
    value: "delete",
    action: showDeleteConfig,
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
  initMenu();

  chooseOption(currentOption, MENU_OPTIONS);
  process.stdin.on(
    "data",
    handleUpdateOptionsMenu(currentOption, MENU_OPTIONS),
  );
};
