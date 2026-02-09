import {
  chooseOption,
  handleUpdateOptionsMenu,
  initMenu,
} from "../../core/input/menu";
import { renderColor } from "../../core/input/text";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen } from "../../core/terminal/screen";
import { ConfigService } from "../../services/configService";
import { showConfigManager } from "../configManager";

export const showDeleteConfig = () => {
  initMenu();

  const existingConfigs = ConfigService.getConfig();

  if (existingConfigs.length === 0) {
    process.stdout.write(
      renderColor("⚠️  No configurations to delete.\n", COLORS.YELLOW),
    );
    setTimeout(() => showConfigManager(), 1500);
    return;
  }

  const menuOptions = [
    ...existingConfigs.map((config) => ({
      id: config.id,
      label: `${config.label} → ${config.value}`,
      value: config.label,
      action: handleDelete(config.label),
    })),
    {
      id: existingConfigs.length + 1,
      label: "Go back",
      value: "back",
      isGoBack: true,
      action: () => {
        process.stdin.removeAllListeners("data");
        showConfigManager();
      },
    },
  ];

  const currentOption = 1;

  const title = renderColor("🗑️  Delete config", [COLORS.BOLD, COLORS.RED]);

  chooseOption(currentOption, menuOptions, { title });
  process.stdin.on(
    "data",
    handleUpdateOptionsMenu(currentOption, menuOptions, title),
  );
};

const handleDelete = (originBranch: string) => () => {
  process.stdin.removeAllListeners("data");
  clearScreen();

  ConfigService.deleteConfig(originBranch);

  process.stdout.write(
    renderColor("✅ Config deleted successfully!\n", [
      COLORS.BOLD,
      COLORS.GREEN,
    ]),
  );
  process.stdout.write(
    renderColor(`   Removed: ${originBranch}\n\n`, COLORS.DIM),
  );

  setTimeout(() => showConfigManager(), 1500);
};
