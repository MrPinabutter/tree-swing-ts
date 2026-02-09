import { clearScreen } from "../../core/terminal/screen";
import { makeQuestion } from "../../core/input/question";
import { renderColor } from "../../core/input/text";
import { COLORS } from "../../core/terminal/colors";
import { ConfigService } from "../../services/configService";
import { showConfigManager } from "../configManager";

const isValidBranchName = (name: string): boolean => {
  return /^[a-zA-Z0-9\-_/]+$/.test(name);
};

export const showCreateConfig = () => {
  process.stdin.removeAllListeners("data");
  clearScreen();

  const existingConfigs = ConfigService.getConfig();

  process.stdout.write(
    renderColor("📋 Current configurations:\n\n", [COLORS.BOLD, COLORS.CYAN]),
  );

  existingConfigs.forEach((config) => {
    process.stdout.write(renderColor(`   • ${config.label}`, COLORS.GREEN));
    process.stdout.write(renderColor(` → ${config.value}\n`, COLORS.DIM));
  });

  process.stdout.write("\n");
  process.stdout.write(
    renderColor(" Create new config\n\n", [COLORS.BOLD, COLORS.YELLOW]),
  );

  makeQuestion(
    renderColor("Origin branch name (e.g. develop): ", COLORS.CYAN),
    (originBranch) => {
      if (!originBranch.trim()) {
        process.stdout.write(
          renderColor(
            "\n⚠️  Origin branch name cannot be empty.\n",
            COLORS.RED,
          ),
        );
        setTimeout(() => showConfigManager(), 1000);
        return;
      }

      if (!isValidBranchName(originBranch.trim())) {
        process.stdout.write(
          renderColor(
            "\n⚠️  Invalid branch name. Only letters, numbers, - / _ are allowed.\n",
            COLORS.RED,
          ),
        );
        setTimeout(() => showConfigManager(), 1000);
        return;
      }

      process.stdout.write("\n");
      makeQuestion(
        renderColor("Prefix for new branches (e.g. for-dev): ", COLORS.CYAN),
        (prefix) => {
          if (!prefix.trim()) {
            process.stdout.write(
              renderColor("\n⚠️  Prefix cannot be empty.\n", COLORS.RED),
            );
            setTimeout(() => showConfigManager(), 1000);
            return;
          }

          if (!isValidBranchName(prefix.trim())) {
            process.stdout.write(
              renderColor(
                "\n⚠️  Invalid prefix. Only letters, numbers, - / _ are allowed.\n",
                COLORS.RED,
              ),
            );
            setTimeout(() => showConfigManager(), 1000);
            return;
          }

          ConfigService.addConfig(originBranch.trim(), prefix.trim());

          process.stdout.write("\n");
          process.stdout.write(
            renderColor("✅ Config added successfully!\n", [
              COLORS.BOLD,
              COLORS.GREEN,
            ]),
          );
          process.stdout.write(
            renderColor(`   ${originBranch} → ${prefix}\n\n`, COLORS.DIM),
          );

          setTimeout(() => showConfigManager(), 1500);
        },
      );
    },
  );
};
