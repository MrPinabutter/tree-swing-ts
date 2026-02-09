import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const CONFIG_FILE = join(dirname(import.meta.dir), "config.txt");

interface Config {
  label: string;
  value: string;
  id: number;
}

export const ConfigService = {
  getConfig: () => {
    const fileContent = readFileSync(CONFIG_FILE, "utf-8")
      .split("\n")
      .filter((line) => line.trim() !== "");

    const config = fileContent.map((line, idx) => {
      const [originBranch, prefix] = line.split("=").map((part) => part.trim());
      return { label: originBranch, value: prefix, id: idx + 1 };
    });

    return config as Config[];
  },
  addConfig: (originBranch: string, prefix: string) => {
    const newConfigLine = `${originBranch}=${prefix}\n`;
    appendFileSync(CONFIG_FILE, newConfigLine);
  },
  deleteConfig: (originBranch: string) => {
    const fileContent = readFileSync(CONFIG_FILE, "utf-8")
      .split("\n")
      .filter(
        (line) => line.trim() !== "" && !line.startsWith(originBranch + "="),
      );

    writeFileSync(CONFIG_FILE, fileContent.join("\n") + "\n");
  },
};
