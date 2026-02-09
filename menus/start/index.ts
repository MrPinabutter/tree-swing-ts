import {
  chooseOption,
  handleUpdateOptionsMenu,
  initMenu,
} from "../../core/input/menu";
import { $ } from "bun";
import { showCursor } from "../../core/terminal/cursor";
import { renderColor } from "../../core/input/text";
import { COLORS } from "../../core/terminal/colors";
import { ConfigService } from "../../services/configService";
import { showConfigManager } from "../configManager";

const currentOption = 1;

export const showMenuStart = () => {
  initMenu();

  const menuOptions = ConfigService.getConfig();
  const otherOption = {
    id: menuOptions.length + 1,
    label: "other",
    value: "other",
    isGoBack: true,
  };

  const options = [
    ...menuOptions.map((option) => ({
      ...option,
      action: handleCreateNewBranch(option.value, option.label),
    })),
    { ...otherOption, action: handleOther },
  ];

  chooseOption(currentOption, [...menuOptions, otherOption]);
  process.stdin.on("data", handleUpdateOptionsMenu(currentOption, options));
};

const handleOther = () => {
  process.stdin.removeAllListeners("data");
  showConfigManager();
};

const handleCreateNewBranch = (prefix: string, branch: string) => async () => {
  const currentBranch = (
    await $`git rev-parse --abbrev-ref HEAD`.text()
  ).trim();

  if (currentBranch.includes(prefix)) {
    process.stdout.write(renderColor(`⚠️  The current branch:`, COLORS.YELLOW));
    process.stdout.write(
      renderColor(` ${currentBranch}\n`, [COLORS.BOLD, COLORS.MAGENTA]),
    );
    process.stdout.write(
      renderColor(`Already includes the prefix`, COLORS.YELLOW),
    );
    process.stdout.write(
      renderColor(` ${prefix}\n\n`, [COLORS.BOLD, COLORS.MAGENTA]),
    );
    process.stdout.write(
      renderColor(
        `❌ Please switch to a branch that doesn't include the prefix "${prefix}" before running this tool.\n`,
        COLORS.RED,
      ),
    );

    showCursor();
    process.exit(0);
  }

  process.stdout.write(
    renderColor("⏳ Fetching and preparing...\n", COLORS.CYAN),
  );

  await $`git fetch origin "${branch}:${branch}" --force`;

  const newBranch = `${prefix}/${currentBranch}`;
  process.stdout.write(renderColor(`📌 New branch: \n`, COLORS.GREEN));
  process.stdout.write(renderColor(`   ${newBranch}\n\n`, COLORS.DIM));

  process.stdout.write(
    renderColor("🗑️  Cleaning up old branch...\n", COLORS.GREEN),
  );
  try {
    await $`git branch -D "${newBranch}"`.quiet();
    process.stdout.write(
      renderColor(`✅ Old branch "${newBranch}" deleted.\n\n`, COLORS.DIM),
    );
  } catch {
    process.stdout.write(
      renderColor(`⚠️ No existing branch to delete.\n\n`, COLORS.DIM),
    );
  }

  process.stdout.write(
    renderColor("🔀 Switching to new branch...\n", COLORS.GREEN),
  );
  await $`git switch -c "${newBranch}"`.quiet();
  process.stdout.write(
    renderColor(`✅ Switched to new branch "${newBranch}".\n\n`, COLORS.DIM),
  );

  process.stdout.write(
    renderColor(`🔗 Merging origin/${branch}...\n`, COLORS.GREEN),
  );
  try {
    await $`git merge "origin/${branch}"`.quiet();
    process.stdout.write(
      renderColor("✅ Success!\n", [COLORS.BOLD, COLORS.GREEN]),
    );
  } catch {
    process.stdout.write(
      renderColor(
        `⚠️  Merge conflicts detected. Please resolve them manually.\n`,
        COLORS.RED,
      ),
    );
    showCursor();
    process.exit(0);
  }

  showCursor();
  process.exit(0);
};
