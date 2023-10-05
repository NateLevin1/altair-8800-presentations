<style>
    * {
        --r-main-font-size: 2rem;
    }
</style>

# Software Components (CP/M)

---

## Diagram of CP/M's Boot Process

  <img src="https://i.ibb.co/NnDZ6yH/image.png" alt="CP/M boot sequence diagram" height="530px" />

---

## CP/M's Device Abstraction

-   Before operating systems like CP/M, programs had to be written for specific hardware
    -   If the device changed or the program was moved to a different computer, it wouldn't work
-   CP/M has device abstractions, and this allows code to be instantly portable to other computers (as long as they are also running CP/M)
-   All disk and I/O accesses are passed through a single entry point into CP/M.
    -   This is done by passing function codes in one register, and the data or buffer address passed in other registers.

---

## Application Programs

-   "Application program" = non-system software
-   Firmware monitor, special RAM areas, and CP/M take up some memory (CP/M about 6k)
-   The rest of the memory is available for application programs - this area of ram is the "Transient program area" / TPA. It begins at a fixed address and has all the RAM not explicitly needed by CP/M
-   Some built in programs:
    -   `ed` = text editor
    -   `asm` = assembler
    -   `LOAD` = loader
    -   `DDT` = debugger

---

## Special Memory Areas / Memory Map

-   The lowest addresses of RAM are reserved for "vectors", which are unconditional jump instructions for hardware interrupts
    -   We don't need to be worried about these for now - just take care not to overwrite them
-   Next, there are buffer areas we'll use for interfacing our program with the OS
-   Monitor functions may also be in a special place in RAM depending on the computer
    -   Leaving space for this was already done by the person who ported CP/M to the computer you are using

---

## Memory Map Diagram

<img src="https://i.ibb.co/2gDv0B1/image.png" alt="Simplified Diagram of an example CP/M Computer" height="530">

---

## Any Questions?
