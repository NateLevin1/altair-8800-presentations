# The Central Processing Unit

By Nate and Julissa

---

## What is the CPU?

The CPU is the <span style="color: red">**heart of the computer**</span>. It is the part of the computer that performs the instructions of a computer program.

The Altair 8800 uses the <span  style="color: aqua">Intel 8080</span> chip.

---

# Parts of the CPU

---

### Timing And Control

Receives and distributes clock signal

<img src="https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-01/s10-u06-m-illustration-of-cpu-clock-speed-original-rwd.jpg" alt="" width="400"/>

---

### Instruction Register

Holds the instruction being executed

<div style="background: white; display: inline-block;">
<img src="https://ubuntourist.codeberg.page/Altair-8800/_images/CPU.svg" alt="" width="400"/>
</div>

---

### Arithmetic

Performs binary and decimal arithmetic via addition. Multiplication is implemented as repeated addition.

<div style="background: white; display: inline-block;">
<img src="https://ubuntourist.codeberg.page/Altair-8800/_images/CPU.svg" alt="" width="400"/>
</div>

---

### Registers

CPU has seven 8-bit registers. They are used to store data and addresses. The accumulator register is a special register that is the primary storage point.

<div style="background: white; display: inline-block;">
<img src="https://ubuntourist.codeberg.page/Altair-8800/_images/CPU.svg" alt="" width="400"/>
</div>

---

### Status bit register

Special purpose register which holds status on the CPU - e.g. carry bit, aux carry bit, sign bit, zero bit, and the parity bit

<div style="font-size: 20px;">

| Bit | Name       | Description                                                                  |
| --- | ---------- | ---------------------------------------------------------------------------- |
| 0   | Carry      | Set if the last operation caused an overflow from bit 7 of the accumulator   |
| 1   | Aux. Carry | Set if the last operation caused an overflow from bit 3 of the accumulator   |
| 2   | Sign bit   | Set if the last operation caused a negative result                           |
| 3   | Zero bit   | Set if the last operation caused a zero result                               |
| 4   | Parity bit | Set if the last operation caused an even number of 1 bits in the accumulator |

</div>

---

### Program counter

Special 16 bit register that holds the address of the next instruction to be executed

<div style="background: white; display: inline-block;">
<img src="https://ubuntourist.codeberg.page/Altair-8800/_images/CPU.svg" alt="" width="400"/>
</div>

---

### Stack pointer

Special 16 bit register that holds the address of the top of the stack. The stack is used to store data temporarily, including where to return to after a subroutine call.

<div style="background: white; display: inline-block;">
<img src="https://ubuntourist.codeberg.page/Altair-8800/_images/CPU.svg" alt="" width="400"/>
</div>

---

# Any questions?

Thanks for listening!
