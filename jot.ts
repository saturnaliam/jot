enum Flags {
  help,
  category,
  note,
}

enum Error {
  no_arg,
  unknown_arg,
  too_many_categories,
}

const send_error = (error: Error, extra: string) => {
  if (error == Error.unknown_arg) {
    console.error(`error: Unknown argument ${extra}`);
  } else if (error == Error.no_arg) {
    if (extra == "0") extra = "help";
    if (extra == "1") extra = "category";
    if (extra == "2") extra = "note";
    console.error(`error: ${extra} expects 1 argument, but none were given.`);
  } else if (error == Error.too_many_categories) {
    console.error(`error: Too many categories provided, only one is supported.`);
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
        parsed.push([current_arg[0], current_arg[1]]);
      } else {
        send_error(Error.unknown_arg, arg);
      }
    }
  }

  // a final check to make sure the last argument isnt screwed up
  if (needs_arg) send_error(Error.no_arg, current_arg[0].toString());

  return parsed;
}

const run = (args: [Flags, string][]) => {
  let category = "";
  let output = "";

  for (const arg of args) {
    if (arg[0] == Flags.help) {
      console.log("usage: jot [OPTIONS]\njot notes to a file\n  -c --category    defines a category for the note\n  -n --note        defines the note to jot down\n  -h --help        displays this help menu");
    } else if (arg[0] == Flags.category) {
      if (category === "") {
        category = arg[1];
      } else {
        send_error(Error.too_many_categories, "");
      }
    } else if (arg[0] == Flags.note) {
      if (category !== "") output += `# ${category}\n`
      output += arg[1] + "\n";
    }
  }

//  Deno.writeTextFileSync("notes.md", output, { append: true });
  console.log(output);
}

const parsed = parse_args();
run(parsed);
