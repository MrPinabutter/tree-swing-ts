import { showCursor } from "../terminal/cursor";
import { createInterface } from "node:readline";

export const makeQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    showCursor();
    process.stdin.removeAllListeners("data");
    process.stdin.removeAllListeners("close");
    process.stdin.removeAllListeners("end");

    if (process.stdin.isPaused()) {
      process.stdin.resume();
    }

    process.stdin.setRawMode(false);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.question(`${question}\n > `, (answer) => {
      rl.close();
      rl.removeAllListeners();
      resolve(answer);
    });
  });
};
