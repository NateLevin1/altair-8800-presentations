// this is the build script that creates documentation.json
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const docsUrl =
    "https://codeberg.org/ubuntourist/Altair8800/raw/branch/main/source/part-4.rst";

const appendixUrl =
    "https://codeberg.org/ubuntourist/Altair8800/raw/branch/main/source/appendix.rst";

async function fetchDocs(url) {
    console.log("Fetching docs...");
    const docs = await fetch(url, {
        userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
    }).then((txt) => txt.text());
    if (docs.startsWith("<!doctype html>")) {
        console.warn("Docs returned an error. Retrying...");
        return await fetchDocs();
    }
    return docs;
}
const txtDocumentation = await fetchDocs(docsUrl);
const txtAppendix = await fetchDocs(appendixUrl);

console.log("Loaded docs from " + docsUrl);

const lines = txtDocumentation.split("\n");

const tableStart = /\| MNEMONIC /;
const infoLineRegex = /\|([^|]+)\|([^|]+)/;
const argRegex = /([^|]+)\|([^|]+)\|$/;
const operationRegex = /\| (\*\*Operation\*\*: )/;
const statusBitsRegex = /\| (\*\*Status Bits(?: Affected)?\*\*: )/;
const exampleRegex = /\| (\*\*Example\*\*: )/;
const textRegex = /\|([^|]+)\|/;
const instrHexCodeRegex = /^ +\|[^`*\n]+([`*])(.+?)\1.+\|(.+)\|/gm;

const result = [];
for (var i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (tableStart.test(line)) {
        // parse the docs
        i += 2; // skip the break
        line = lines[i];

        // mnemonic and instructions
        const match = line.match(infoLineRegex);
        if (!match) throw new Error("Could not parse line " + line);
        let [_match, mnemonic, instruction] = match;

        mnemonic = mnemonic.trim().replaceAll("``", "");
        instruction = instruction.trim();
        const args = [];

        // args
        let argMatch = line.match(argRegex);
        while (!operationRegex.test(line)) {
            if (argMatch) {
                let [_match, binary, position] = argMatch;
                binary = binary.trim();
                position = position.trim().slice(1, -1);
                args.push({ binary, position });
            }
            i++;
            line = lines[i];
            argMatch = line.match(argRegex);
        }

        // merge args
        for (var j = 0; j < args.length; j++) {
            // if position isn't truthy, add binary to previous arg's binary
            if (!args[j].position) {
                args[j - 1].binary += " " + args[j].binary;
                args.splice(j, 1);
                j--;
            }
        }

        const [operationI, operation] = readText(lines, i, operationRegex);
        i = operationI;
        const [statusI, statusBits] = readText(lines, i, statusBitsRegex);
        i = statusI;
        const [exampleI, example] = readText(lines, i, exampleRegex);
        i = exampleI;

        result.push({
            id: result.length,
            mnemonic,
            instruction,
            args,
            operation,
            statusBits,
            example,
        });
    }
}

for (const [
    _match,
    _separator,
    fullInstrSource,
    dirtyHex,
] of txtAppendix.matchAll(instrHexCodeRegex)) {
    const hex = dirtyHex.replace(/`|\*/g, "").trim();
    const mnemonic = fullInstrSource.split(" ")[0];
    const instr = result.find((instr) => instr.mnemonic === mnemonic);
    if (!instr) {
        console.warn("Could not find instruction " + mnemonic);
        continue;
    }
    if (!instr.usages) instr.usages = [];
    instr.usages.push({ instr: fullInstrSource, hex });
}

const instrCount = result.length;
console.log("Parsed " + instrCount + " instructions");

fs.writeFileSync(
    path.join(__dirname, "documentation.json"),
    JSON.stringify(result, null, 4)
);

console.log("Successfully parsed and outputted documentation.json");

function readText(lines, i, startRegex) {
    let line = lines[i];
    const initialMatch = line.match(startRegex);
    if (!initialMatch) return [i + 1, null];
    line = line.replace(initialMatch[1], "");

    let result = "";
    let text = line.match(textRegex);
    while (text) {
        result += text[1].trim() + " ";
        i++;
        line = lines[i];
        text = line.match(textRegex);
    }
    i++; // skip separator
    return [i, result ? result.slice(0, result.length - 1) : null];
}
