# Reference bill of materials

This is a design BOM, not a purchase order. Prices are rough one-off USD estimates before tax and shipping. Distributor stock changes quickly, and the user's country was not specified. Buy semiconductors from an authorised distributor or use the listed LCSC/JLCPCB entries for assembled prototypes.

## ICs and semiconductors

| Ref | Part | Qty | Est. each | Datasheet or product page | Example buy link | Why it is here |
| --- | --- | ---: | ---: | --- | --- | --- |
| U1 | RP2354B, QFN-80 | 1 | $1.40 to $1.70 | [Raspberry Pi](https://www.raspberrypi.com/products/rp2350/) | [LCSC C39843328](https://www.lcsc.com/product-detail/C39843328.html) | 48 GPIO and 2 MB in-package flash. Specify A4 stepping. |
| U2 to U5 | DRV8256PRGER | 4 | $2.30 to $3.50 | [TI DRV8256](https://www.ti.com/product/DRV8256) | [TI ordering page](https://www.ti.com/product/DRV8256/part-details/DRV8256PRGER) | One protected, current-regulating H-bridge per motor. |
| U6 | SN74LVC244APWR | 1 | $0.45 to $0.60 | [TI SN74LVC244A](https://www.ti.com/product/SN74LVC244A) | [LCSC C7668](https://www.lcsc.com/product-detail/C7668.html) | Converts eight 5 V encoder signals to 3.3 V and remains safe when unpowered. |
| U7 | SN74LVC1G125DBVR | 1 | $0.20 to $0.50 | [TI SN74LVC1G125](https://www.ti.com/product/SN74LVC1G125) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgB4EMC2IAugL5A) | Tri-state transmit buffer for the half-duplex servo bus. |
| U8 | SN74LVC1G17DBVR | 1 | $0.20 to $0.50 | [TI SN74LVC1G17](https://www.ti.com/product/SN74LVC1G17) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgB4CMA2IAugL5A) | 5.5 V-tolerant Schmitt receiver with power-off protection. |
| U9 | TLV75533PDBVR | 1 | $0.20 to $0.60 | [TI TLV755P](https://www.ti.com/product/TLV755P) | [LCSC C404027](https://www.lcsc.com/product-detail/C404027.html) | 500 mA, 3.3 V logic regulator from USB VBUS. |
| U10 | USBLC6-2SC6 or equivalent | 1 | $0.30 to $0.80 | [ST USBLC6-2](https://www.st.com/en/protection-devices/usblc6-2.html) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgKwBoQF0BfIA) | Low-capacitance USB D+ and D- ESD protection. |
| D1 | SMBJ15A | 1 | $0.30 to $0.70 | [Littelfuse SMBJ](https://www.littelfuse.com/products/tvs-diodes/surface-mount/smbj) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgJwK4DMAugL5A) | Clamps motor-rail transients below the driver's 48 V operating limit. Validate with the actual supply. |
| D2 | TPD1E10B06DPYR or equivalent | 1 | $0.15 to $0.40 | [TI TPD1E10B06](https://www.ti.com/product/TPD1E10B06) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgJwK4DMAugL5A) | ESD protection at `SERVO_DATA`. |
| U11 | LM74700QDBVRQ1 | 1 | $1.20 to $2.00 | [TI LM74700-Q1](https://www.ti.com/product/LM74700-Q1) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgJwK4DMAugL5A) | Ideal-diode controller for reverse-polarity protection. Copy TI's gate and bypass network. |
| Q1 | CSD18540Q5B, 60 V N-MOSFET | 1 | $1.00 to $1.80 | [TI CSD18540Q5B](https://www.ti.com/product/CSD18540Q5B) | [DigiKey search](https://www.digikey.com/en/products/result?s=N4IgTCBcDaIMoEsDGAXApgAgJwK4DMAugL5A) | Low-loss pass FET controlled by U11. Check dissipation at the chosen fuse current. |

## Connectors, protection, and electromechanical parts

| Ref | Part | Qty | Est. total | Link | Notes |
| --- | --- | ---: | ---: | --- | --- |
| J1 | USB4105-GF-A USB-C receptacle or equivalent | 1 | $1.00 | [GCT USB4105](https://gct.co/connector/usb4105) | USB 2.0 device and logic power. Use a part with shell stakes. |
| J2 | XT30PW-M board connector or 15 A keyed equivalent | 1 | $1.50 | [Amass XT30 family search](https://www.digikey.com/en/products/filter/barrel-connectors/power-connectors/435) | `VMOTOR_IN`; choose a genuine, assembly-compatible footprint. |
| J3 to J6 | Molex Micro-Fit 3.0, 2-circuit board header | 4 | $4.00 | [Molex Micro-Fit 3.0](https://www.molex.com/en-us/products/connectors/wire-to-board-connectors/micro-fit-connectors) | Motor outputs. Rated with suitable contacts and wire. |
| J7 to J10 | JST-GH, 4-pin board header | 4 | $3.00 | [JST GH series](https://www.jst-mfg.com/product/index.php?series=105) | Encoder power, ground, A, and B. |
| J11, J12 | 5264-style 3-pin servo header | 2 | $1.00 | [Waveshare reference circuit](https://files.waveshare.com/upload/d/d3/Bus_servo_control_circuit.pdf) | Parallel `DATA`, `V+`, `GND` connectors. Confirm mating-harness polarity. |
| J13 | 1.27 mm Cortex-style SWD header or Tag-Connect footprint | 1 | $1.00 | [Tag-Connect](https://www.tag-connect.com/) | Programming and debug. |
| F1 | 500 mA USB resettable fuse | 1 | $0.25 | [Littelfuse resettable PTC](https://www.littelfuse.com/products/polyswitch-resettable-pptcs) | Limits faults on USB-derived logic power. |
| F2 | 10 A to 15 A replaceable motor-input fuse and holder | 1 | $2.00 | [Littelfuse blade fuses](https://www.littelfuse.com/products/fuses/automotive-passenger-car/blade-fuses) | Size for connector and wiring. Put it before the board or at the entry. |
| F3 | Servo branch fuse, value chosen for fitted servos | 1 | $1.00 | [Littelfuse blade fuses](https://www.littelfuse.com/products/fuses/automotive-passenger-car/blade-fuses) | Keeps a damaged servo cable from taking down motor copper. |
| JP1 | Removable high-current servo power link | 1 | $0.50 | Supplier dependent | Allows signal-only servo testing and safe isolation. |
| SW1, SW2 | BOOTSEL and RUN tactile switches | 2 | $0.40 | Supplier dependent | Follow Raspberry Pi reference footprints and circuits. |

## Timing, magnetics, and capacitors

| Ref | Value or part | Qty | Est. total | Link | Notes |
| --- | --- | ---: | ---: | --- | --- |
| Y1 | Abracon ABM8-272-T3, 12 MHz | 1 | $0.80 | [Abracon search](https://abracon.com/search/ABM8-272-T3) | Use the exact crystal and load network from Raspberry Pi's current reference design. |
| L1 | 3.3 uH polarised inductor from RP2350B reference BOM | 1 | $0.60 | [RP2350 hardware guide](https://datasheets.raspberrypi.com/rp2350/hardware-design-with-rp2350.pdf) | Orientation and placement matter in the internal 1.1 V regulator loop. |
| C1 | 1000 uF, 25 V, low-ESR electrolytic | 1 | $1.50 | Supplier dependent | Main `VMOTOR` bulk capacitor. Verify ripple-current rating. |
| C2 to C5 | 100 uF, 25 V, low-ESR electrolytic | 4 | $2.50 | Supplier dependent | One local bulk capacitor per motor driver. |
| C6 to C9 | 10 nF, 50 V, X7R | 4 | $0.20 | Supplier dependent | One VM ceramic per driver. |
| C10 to C13 | 22 nF, 25 V, X7R | 4 | $0.20 | Supplier dependent | CPH to CPL charge-pump capacitors. |
| C14 to C17 | 220 nF, 25 V, X7R | 4 | $0.25 | Supplier dependent | VCP to VM charge-pump capacitors. |
| C18 to C21 | 470 nF, 10 V, X7R | 4 | $0.20 | Supplier dependent | DVDD bypass capacitors. |
| C22 to C25 | 10 nF, 10 V, X7R | 4 | $0.20 | Supplier dependent | VREF filters. |
| MCU decoupling | 100 nF, 1 uF, and 4.7 uF X7R set | 1 set | $1.50 | [RP2350 Minimal KiCad](https://pip.raspberrypi.com/categories/1214-rp2350) | Copy values, count, and placement from the current RP2350B minimal reference. |
| Encoder bypass | 100 nF, 10 V, X7R | 4 | $0.20 | Supplier dependent | At the four encoder connectors. |
| Logic bulk | 10 uF, 10 V, X7R | 2 | $0.30 | Supplier dependent | USB_5V and 3V3 local bulk. |

## Resistors and small passives

| Function | Values and quantity | Est. total | Notes |
| --- | --- | ---: | --- |
| DRV current limit | 4 × 28.0 kOhm, 4 × 10.0 kOhm, 1 percent | $0.20 | About 1.99 A nominal from a 5 V DVDD. Keep each divider beside its VREF pins. |
| Motor logic damping | 8 × 33 ohm | $0.10 | Near the RP2354B. |
| Driver fault pull-ups | 4 × 10 kOhm | $0.10 | To 3.3 V. |
| Driver sleep default | 1 × 100 kOhm | $0.02 | Pulls all bridges asleep during reset. |
| Encoder input damping | 8 × 100 ohm | $0.10 | Near the encoder buffer inputs. |
| Servo data damping | 1 × 220 ohm | $0.02 | Between TX buffer and connector-side bus node. |
| Servo data idle | 1 × 10 kOhm | $0.02 | Pulls `SERVO_DATA` to 3.3 V while all transmitters are disabled. |
| Servo TX disable | 1 × 10 kOhm | $0.02 | Pull-up on active-low TX enable. |
| USB-C configuration | 2 × 5.1 kOhm, 1 percent | $0.05 | One from each CC pin to ground. |
| USB data series | 2 × 27 ohm, 1 percent | $0.05 | Near the MCU, per Raspberry Pi reference. |
| VMOTOR ADC divider | 100 kOhm top, 22 kOhm bottom, 10 nF filter | $0.08 | 12.6 V becomes about 2.27 V. Confirm ADC scaling in firmware. |

## Estimated prototype cost

The populated controller is roughly $30 to $45 in one-off parts before PCB fabrication, assembly, motors, servos, cables, and the external 6 V or 12 V supply. Connectors and protection parts account for more of that number than the MCU.

Do not substitute the similar `DRV8256E` without changing firmware and pin naming. `DRV8256E` uses PH/EN control; this guide assigns the two-input PWM interface of `DRV8256P`.
