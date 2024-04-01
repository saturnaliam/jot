#!/usr/bin/env -S deno run
enum Flags {
  help,
  category,
  note,
}

const send_error = (error: string) => {
  console.error(error);
  Deno.exit(1);
}

const parse_args = (): [Flags, string][] => {
  const parsed: [Flags, string][] = [];
  const current_arg: [Flags, string] = [0, ""];
  let needs_arg = false;

  for (const arg of Deno.args) {
    if (arg == "-h" || arg == "--help") {
      if (needs_arg) send_error(`error: Argument expected for ${current_arg[1]} but not given`);
      parsed.push([Flags.help, ""]);
    } else if (arg == "-c" || arg == "--category") {
      if (needs_arg) send_error(`error: Argument expected for ${current_arg[1]} but not given`);
      needs_arg = true;
      current_arg[0] = Flags.category;
    } else if (arg == "-n" || arg == "--note") {
      if (needs_arg) send_error(`error: Argument expected for ${current_arg[1]} but not given`);
      needs_arg = true;
      current_arg[0] = Flags.note;
    } else {
      if (needs_arg) {
        current_arg[1] = arg;
        needs_arg = false;
        parsed.push(current_arg);
        current_arg[0] = 0;
        current_arg[1] = "";
      } else {
        send_error(`error: Unknown argument ${arg}`);
      }
    }
  }

  i

  return parsed;
}

console.log(parse_args());
