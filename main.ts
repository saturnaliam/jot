#!/usr/bin/env -S deno run
enum Flags {
  help,
  category,
  note,
}

enum Error {
  no_arg,
  unknown_arg,
}

const send_error = (error: Error, extra: string) => {
  if (error == Error.unknown_arg) {
    console.error(`error: Unknown argument ${extra}`);
  } else if (error == Error.no_arg) {
    if (extra == "0") extra = "help";
    if (extra == "1") extra = "category";
    if (extra == "2") extra = "note";
    console.error(`error: ${extra} expects 1 argument, but none were given.`);
  }

  Deno.exit(1);
}

const parse_args = (): [Flags, string][] => {
  const parsed: [Flags, string][] = [];
  const current_arg: [Flags, string] = [0, ""];
  let needs_arg = false;

  for (const arg of Deno.args) {
    if (arg == "-h" || arg == "--help") {
      if (needs_arg) send_error(Error.no_arg, current_arg[0].toString());
      parsed.push([Flags.help, ""]);
    } else if (arg == "-c" || arg == "--category") {
      if (needs_arg) send_error(Error.no_arg, current_arg[0].toString());
      needs_arg = true;
      current_arg[0] = Flags.category;
    } else if (arg == "-n" || arg == "--note") {
      if (needs_arg) send_error(Error.no_arg, current_arg[0].toString());
      needs_arg = true;
      current_arg[0] = Flags.note;
    } else {
      // adding to the past argument then pushing that into the parsed array
      if (needs_arg) {
        current_arg[1] = arg;
        needs_arg = false;
        parsed.push(current_arg);
      } else {
        send_error(Error.unknown_arg, arg);
      }
    }
  }

  // a final check to make sure the last argument isnt screwed up
  if (needs_arg) send_error(Error.no_arg, current_arg[0].toString());

  return parsed;
}

console.log(parse_args());
