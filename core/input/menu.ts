import { COLORS } from "../terminal/colors";
import { hideCursor, showCursor } from "../terminal/cursor";
import { clearScreen } from "../terminal/screen";
import { KeyCode } from "./keycodes";
import { renderColor } from "./text";

interface InitMenuOptions {
  hideCursor?: boolean;
}

export const initMenu = (options?: InitMenuOptions) => {
  const shouldHideCursor = options?.hideCursor ?? true;

  process.stdin.removeAllListeners("data");

  clearScreen();
  if (shouldHideCursor) {
    hideCursor();
  }
  process.stdin.setRawMode(true);
  process.stdin.resume();
};

export enum MENU_STATE {
  MAIN = 1,
}

export const chooseOption = (
  selected: number,
  options: { id: number; label: string; value: string; isGoBack?: boolean }[],
  props?: { title?: string },
) => {
  const title = props?.title ?? "Select an option:";

  process.stdout.write(
    `${renderColor(title, [COLORS.CYAN, COLORS.BOLD])} ${renderColor(
      "(use arrow keys, press Enter to confirm)",
      COLORS.DIM,
    )}\n\n`,
  );

  options.forEach((option) => {
    if (option.isGoBack) {
      renderIsGoBackOption(option.label, option.id === selected);
      return;
    }

    if (option.id === selected) {
      process.stdout.write(
        `${renderColor(" ▶ " + option.label, [COLORS.BG_GREEN, COLORS.BLACK, COLORS.BOLD])}\n`,
      );
    } else {
      process.stdout.write(
        renderColor("   " + option.label, COLORS.DIM) + "\n",
      );
    }
  });
};

export const handleUpdateOptionsMenu =
  (
    selectedOption: number,
    options: {
      id: number;
      label: string;
      value: string;
      action: () => Promise<void> | void;
    }[],
    title?: string,
  ) =>
  async (key: Buffer) => {
    if (key[2] === KeyCode.DOWN_ARROW) {
      if (selectedOption < options.length) {
        selectedOption++;
      } else {
        selectedOption = 1;
      }

      clearScreen();
      chooseOption(selectedOption, options, { title });
    } else if (key[2] === KeyCode.UP_ARROW) {
      if (selectedOption > 1) {
        selectedOption--;
      } else {
        selectedOption = options.length;
      }
      clearScreen();
      chooseOption(selectedOption, options, { title });
    } else if (key[0] === KeyCode.ENTER) {
      clearScreen();
      process.stdin.removeAllListeners("data");

      await options.find((option) => option.id === selectedOption)?.action();
    } else if (key[0] === KeyCode.CTRL_C) {
      showCursor();
      clearScreen();
      process.exit();
    }
  };

const renderIsGoBackOption = (label: string, isSelected: boolean) => {
  if (isSelected) {
    process.stdout.write(
      `${renderColor(" ← " + label, [COLORS.BG_RED, COLORS.BOLD])}${COLORS.RESET}\n`,
    );
    return;
  }

  process.stdout.write(
    `${renderColor(" ← " + label, COLORS.RED)}${COLORS.RESET}\n`,
  );
};
