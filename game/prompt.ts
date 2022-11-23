type Action = (args: string[]) => string;

interface BaseCommand {
  name: string;
  args?: string[];
  action: Action;
  help?: string;
}

interface Command extends BaseCommand {
  enabled: boolean;
}

export class CommandManager {
  private commands: Command[];
  private errorMsg: string;

  constructor(errorMsg: string) {
    this.commands = [];
    this.errorMsg = errorMsg;
  }

  addCmd({ name, args, action, help }: BaseCommand) {
    const exists = this.commands.find((it) => it.name === name);
    if (exists) throw new Error("Prompt already exists");
    this.commands.push({ name, args, action, help, enabled: true });
  }

  execCmd(prompt: string, errorMsg?: string) {
    const parts = prompt.toLowerCase().trim().split(/\ +/);
    const [cmdName] = parts;
    const cmd = this.commands.find((it) => it.enabled && it.name === cmdName);
    if (!cmd) return errorMsg ?? this.errorMsg;
    const args = parts.splice(1);
    return cmd.action(args);
  }

  enableCmd(name: string) {
    const cmd = this.findCmd(name);
    cmd.enabled = true;
  }

  disableCmd(name: string) {
    const cmd = this.findCmd(name);
    cmd.enabled = false;
  }

  listCmds(enabled = true) {
    return this.commands.filter((it) => it.enabled === enabled);
  }

  private findCmd(name: string) {
    const cmd = this.commands.find((it) => it.name === name);
    if (!cmd) throw new Error(`Command with id ${name} was not found`);
    return cmd;
  }
}
