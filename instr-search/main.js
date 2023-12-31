const search = document.getElementById("search");
const results = document.getElementById("results");

const instrToSearchString = (instr) => {
    return (
        instr.mnemonic +
        " " +
        instr.instruction +
        " " +
        instr.operation +
        " " +
        (instr.example ?? "") +
        " " +
        instr.usages.map((usage) => usage.hex).join(" ")
    );
};

const index = new FlexSearch.Index({
    tokenize: "forward",
});

let instrs = {};
async function load() {
    const documentation = await fetch("documentation.json").then((txt) =>
        txt.json()
    );
    for (const instr of documentation) {
        index.add(instr.id, instrToSearchString(instr));
        instrs[instr.id] = instr;
    }
    updateResults(Object.keys(instrs));
}
load();

search.addEventListener("input", () => {
    if (search.value === "") {
        updateResults(Object.keys(instrs));
        return;
    }
    const searchResults = index.search(search.value);
    updateResults(searchResults);
});

function updateResults(searchResults) {
    if (searchResults.length === 0) {
        results.innerHTML =
            '<p class="no-search-results">No search results found.</p>';
        return;
    }

    results.innerHTML = "";

    for (const instrId of searchResults) {
        const instr = instrs[instrId];
        const instrElement = document.createElement("div");
        instrElement.className = "mb-8 flex flex-col gap-4";
        instrElement.classList.add("instr");

        const exampleHtml = instr.example
            ? `<div class="example"><span class="font-bold">Example: </span>${rstToHtml(
                  instr.example
              )}</div>`
            : "";

        let argsHtml = "";
        for (const { binary, position } of instr.args) {
            const isBinaryValid = /^(?:0|1| )+$/.test(binary);
            const binaryNum = parseInt(binary.replace(/ /g, ""), 2);
            let hex;
            if (isBinaryValid) {
                hex = binaryNum.toString(16).toUpperCase().padStart(2, "0");
            }
            argsHtml += `
            <span class="">${position}: </span>
            <span class="font-mono bg-neutral-200 rounded p-0.5 px-1.5 select-all">${rstToHtml(
                binary
            )}</span>
            ${
                hex
                    ? `<span class="font-mono bg-neutral-200 rounded p-0.5 px-1.5 select-all">${rstToHtml(
                          hex
                      )}</span>`
                    : "<div></div>"
            }
            `;
        }

        let usagesHtml = "";
        if (instr.usages.length > 1) {
            for (const { instr: instrUsage, hex } of instr.usages) {
                if (hex) {
                    if (!usagesHtml) {
                        usagesHtml += `<div class="font-bold">Usages:</div>`;
                    }
                    usagesHtml += `
                    <div>
                        <span class="font-mono">${instrUsage}</span>
                        <span>=</span>
                        <span class="font-mono bg-neutral-200 rounded p-0.5 px-1.5 select-all">${hex}</span>
                    </div>
                    `;
                }
            }
        }

        instrElement.innerHTML = `
            <h2 class="mnemonic font-bold font-mono text-xl border-b">${
                instr.mnemonic
            }<span class="instruction font-normal font-sans"> — ${rstToHtml(
            instr.instruction
        )}</span></h2>
            <div class="grid grid-cols-[max-content_max-content_max-content] gap-3 text-[0.9em]">
                ${argsHtml}
            </div>
            <div class="operation">${rstToHtml(instr.operation)}</div>
            ${exampleHtml}
            ${usagesHtml}
        `;
        results.appendChild(instrElement);
    }
}

updateResults([]);

// very basic, should use a library
function rstToHtml(rst) {
    return rst
        .replace(
            /``([^`]+)``/g,
            (_match, code) =>
                `<span class="font-mono bg-neutral-200 rounded p-0.5 text-[0.9em]">${code}</span>`
        )
        .replace(
            /\*\*([^*]+)\*\*/g,
            (_match, code) => `<span class="font-bold">${code}</span>`
        )
        .replace(
            /\*([^*]+)\*/g,
            (_match, code) => `<span class="italic">${code}</span>`
        )
        .replace(/\\/g, "");
}
