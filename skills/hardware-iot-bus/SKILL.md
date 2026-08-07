---
name: hardware-iot-bus
description: Low-level I2C and SPI bus peripheral control for embedded Linux boards (Orange Pi, Raspberry Pi, RISC-V).
version: 2.0.0
author: AbdullahMalik17
tags: [hardware, iot, i2c, spi, gpio, embedded]
---

# ⚡ Hardware I2C & SPI Bus Skill

Use this skill to interface directly with physical sensors, displays, and microcontrollers on Linux Single Board Computers (SBCs).

## Bus Protocol Features

- **I2C Protocol**:
  - Scan active bus addresses: `i2cdetect`
  - Read register values: `i2cget -y <bus> <chip-address> <data-address>`
  - Write register values: `i2cset -y <bus> <chip-address> <data-address> <value>`
- **SPI Protocol**:
  - Full-duplex byte transfers to `/dev/spidevX.Y`
  - Mode configuration (Clock polarity/phase, speed Hz)

## Edge Safety Guidelines
- Verify pinouts and voltage levels (3.3V vs 5V) before writing registers.
- Always perform address scanning before initializing sensor read loops.
