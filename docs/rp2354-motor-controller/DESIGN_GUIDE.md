# RP2354B four-motor controller design guide

## What this board is

This is a controller for four independent brushed DC encoder motors and one daisy-chained TTL serial-servo bus. An RP2354B handles four PWM bridges, eight quadrature encoder signals, USB, and the half-duplex servo protocol.

The design targets motors with no more than 2 A stall current each. It accepts an externally regulated motor supply in either of these configurations:

- 6 V mode for 6 V motors and 6 V or 7.4 V-class Feetech servos.
- 12 V mode for 12 V motors and 12 V Feetech servos.

The board does not convert 12 V to 6 V. Select the voltage at the external supply. This keeps a hot, high-current buck converter off the controller and makes the 6 V or 12 V choice unambiguous.

USB-C supplies only the RP2354B and its 3.3 V logic. It never supplies motor or servo current.

## Design targets

| Requirement | Design value |
| --- | --- |
| Motor channels | 4, independent direction and PWM |
| Motor supply input | 5.5 V to 12.6 V regulated |
| Motor stall current | 2 A maximum per channel |
| DRV8256P current threshold | 2.0 A nominal, set by fixed resistors |
| PWM frequency | 20 kHz starting point |
| Encoder interface | 5 V A/B push-pull Hall outputs, 4 encoders |
| Encoder count rate | Set by motor; PIO decoding leaves the CPUs free |
| Serial servo | Feetech/Waveshare ST or SC TTL, half-duplex UART |
| Servo baud rate | Up to 1 Mbit/s target |
| USB | Full-speed USB 2.0 device, USB-C receptacle |
| Logic supply | 3.3 V from USB VBUS |

## The architecture

The design has two power domains.

`USB_5V` enters through USB-C, passes a resettable fuse, and feeds a 3.3 V LDO. It powers the MCU, encoder receiver, and servo transceiver. Two 5.1 kOhm resistors on CC1 and CC2 identify the board as a USB sink.

`VMOTOR_IN` enters through a high-current connector, fuse, reverse-polarity stage, TVS clamp, and bulk capacitor. The protected `VMOTOR` rail feeds all four DRV8256P chips and the serial-servo power header. Use an external supply set to 6 V or 12 V. The supply, connector, switch, fuse, and wiring must all handle the combined stall current.

The grounds meet at the protected motor-power entry. Do not run motor current through the USB connector area or beneath the crystal, USB pair, encoder buffer, or MCU.

## Why RP2354B

RP2354B is the 80-pin, 48-GPIO member of the RP2354 family. It includes 2 MB of Winbond QSPI flash in the package. Raspberry Pi states that it is pin-compatible with RP2350B.

The in-package flash matters here. It removes an external flash package and keeps the noisy QSPI bus short. The six QSPI package pins still connect to the internal flash die. Leave them unrouted except for a short `BOOTSEL_N` connection to QSPI_SS. Set `QSPI_IOVDD` to 3.3 V and decouple it at the pin.

Use the A4 silicon stepping. Raspberry Pi fixed the original GPIO high-impedance erratum in A4. The current datasheet also permits 5 V on some digital GPIOs while IOVDD is powered, but this design does not rely on that. A power-off-protected buffer receives all eight 5 V encoder signals.

Copy the power, 12 MHz crystal, 3.3 uH regulator inductor, decoupling, RUN, SWD, USB, and BOOTSEL circuits from Raspberry Pi's current RP2350B Minimal KiCad design. Changing the chip value from RP2350B to RP2354B is valid because the package and pinout are the same. Remove any external primary flash.

## One DRV8256P per motor

`DRV8256PRGER` is the correct orderable part number. It is the PWM-interface version in a 24-pin, 4 mm by 4 mm VQFN package. Each device drives one bidirectional brushed motor, so the board needs four.

The driver accepts 1.8 V, 3.3 V, and 5 V logic. Its 4.5 V to 48 V operating range easily covers either motor rail. The headline current rating is not the continuous board current. Copper area, airflow, switching frequency, ambient temperature, and motor duty cycle set the real limit. At 2 A, nominal conduction loss alone is about 0.66 W per driver using the datasheet's 165 mOhm bridge resistance at 25 C. Expect more when the die is hot.

### Reference channel circuit

Repeat this circuit four times. Keep every capacitor in the list beside its corresponding driver, not in a shared capacitor bank.

| DRV8256P pin or net | Connection |
| --- | --- |
| `VM` pins 1 and 8 | `VMOTOR`; 10 nF ceramic and 100 uF low-ESR local bulk to `PGND` |
| `PGND` pins 2 and 7 | Power-ground pour and exposed-pad ground |
| `GND` pin 9 | Quiet ground, joined to the local power ground at the exposed pad |
| `OUT1` pins 3 and 6 | Tie together with wide copper, then route to motor terminal A |
| `OUT2` pins 4 and 5 | Tie together with wide copper, then route to motor terminal B |
| `IN1` pin 20 | MCU `Mx_IN1`, with 33 ohm series resistor near MCU |
| `IN2` pin 19 | MCU `Mx_IN2`, with 33 ohm series resistor near MCU |
| `nSLEEP` pin 21 | Shared `DRV_SLEEP`; add one 100 kOhm pull-down so reset means off |
| `nFAULT` pin 11 | Individual `Mx_FAULT_N`, 10 kOhm pull-up to 3.3 V |
| `VREF` pins 12 and 13 | Tie together; 28.0 kOhm to DVDD, 10.0 kOhm to GND, 10 nF to GND |
| `TOFF` pin 14 | GND for 7 us chopping off-time |
| `DECAY` pin 16 | DVDD for smart-tune ripple control |
| `DVDD` pin 10 | 470 nF X7R to GND, placed at the pin; do not use as a board supply |
| `CPH` pin 23 to `CPL` pin 22 | 22 nF X7R, at least 25 V |
| `VCP` pin 24 to `VM` | 220 nF X7R, at least 25 V |
| Exposed pad 25 | Solid ground pad with a thermal-via array |

The fixed divider gives approximately:

`VREF = 5.0 V × 10.0 kOhm / (28.0 kOhm + 10.0 kOhm) = 1.316 V`

For VREF below 3.3 V, TI specifies:

`ITRIP = VREF / 0.66 V/A = 1.99 A`

Treat this as an overcurrent ceiling, not closed-loop torque measurement. DRV8256P does not expose an analog motor-current output.

### Bridge states

| `nSLEEP` | `IN1` | `IN2` | Result |
| --- | --- | --- | --- |
| 0 | X | X | Outputs high impedance, driver asleep |
| 1 | 0 | 0 | Low-side brake |
| 1 | 0 | 1 | Reverse |
| 1 | 1 | 0 | Forward |
| 1 | 1 | 1 | High-side brake |

Drive one input with 20 kHz PWM while holding the other at the state needed for the requested direction. Ramp duty to zero before changing direction. Use low-side brake during controlled stops unless testing shows coast is better for the mechanism.

## Encoder inputs

`ENC_5V` comes from the fused USB 5 V rail. Keep the total MCU, buffer, indicator, and encoder load within the USB current budget. Each motor gets a separate four-pin encoder connector:

1. `ENC_5V`
2. `GND`
3. `ENCx_A_5V`
4. `ENCx_B_5V`

Place a 100 nF capacitor between `ENC_5V` and ground at each connector. Add 100 ohm series resistors on A and B, then feed all eight signals into one `SN74LVC244APWR` powered from 3.3 V. Tie both active-low output enables to ground.

The SN74LVC244A accepts inputs up to 5.5 V and supports partial-power-down isolation. That second point matters because the motor supply may be present while USB and IOVDD are off. Its 3.3 V outputs become `ENC1_A` through `ENC4_B` and connect to contiguous RP2354B pins for a compact PIO decoder.

Add low-capacitance ESD protection near encoder connectors if cables leave the chassis. For very long or hostile cables, use differential line drivers at the encoders instead of trying to filter noisy single-ended Hall signals on the controller.

## Feetech TTL serial-servo bus

The servo interface uses three signals at each parallel bus connector:

1. `SERVO_DATA`
2. `SERVO_V+`
3. `GND`

Match the harness against the exact servo documentation. Similar-looking three-pin connectors sometimes reverse power and ground.

`SERVO_V+` comes from `VMOTOR` through a separate fuse and removable power link. The data transceiver runs from 3.3 V:

- `SERVO_TX` drives `SERVO_DATA` through an `SN74LVC1G125` tri-state buffer and a 220 ohm series resistor.
- `SERVO_TX_EN_N` controls the buffer. A 10 kOhm pull-up disables transmit during reset.
- `SERVO_DATA` feeds `SERVO_RX` through an `SN74LVC1G17` Schmitt buffer. Its input tolerates 5.5 V and provides power-off protection.
- A 10 kOhm pull-up to 3.3 V defines the idle state while every transmitter is disabled.
- Put a low-capacitance ESD diode at the data connector.
- The receiver sees transmitted bytes as echo. Firmware should drain or ignore them.

Use the Feetech servo variant that matches the external rail. The 7.4 V STS3215-C001 is specified for 6 V to 7.4 V. The 12 V STS3215-C018 is the 12 V version. Never feed the 7.4 V model from a 12 V rail.

One STS3215 can draw about 2 A at stall in the 6 V family or 2.7 A in the 12 V family. Add every attached servo's stall current to the power budget. Daisy-chain count is usually limited by current and cable drop long before the protocol's ID range.

## USB-C and logic power

Use a USB 2.0 Type-C receptacle, not a power-delivery controller. Connect 5.1 kOhm from CC1 to ground and another 5.1 kOhm from CC2 to ground. Do not short the CC pins together.

Route D+ and D- as a short 90 ohm differential pair. Put the ESD array at the receptacle and the two 27 ohm source-series resistors near the RP2354B. Avoid stubs, test pads, vias, and copper-plane splits under the pair.

Feed VBUS through a 500 mA resettable fuse into the 3.3 V regulator. A TLV75533P is adequate for the controller logic. Check its thermal rise with the final firmware and attached expansion loads. Do not join USB VBUS to `VMOTOR` or `SERVO_V+`.

## Motor and servo power budget

Start with the stall case, even if firmware normally prevents it.

`I_supply >= 4 × I_motor_stall + sum(I_servo_stall)`

For four 2 A motors and one 12 V STS3215:

`I_supply >= 4 × 2 A + 2.7 A = 10.7 A`

A 12 V, 15 A supply gives useful wiring and transient margin. If no bus servo is fitted, a 10 A supply is a sensible starting point. Select the input fuse for the wiring and connector, not merely for the expected load.

Motor braking can raise `VMOTOR`, especially with a bench supply that cannot sink current. Use the local bulk capacitance and TVS, watch the rail on an oscilloscope, and avoid abrupt full-speed reversals. A battery usually absorbs returned energy better than a one-quadrant bench supply.

## PCB layout that will make or break it

Use four layers and 2 oz outer copper if possible.

1. Put the motor input, fuse, reverse-polarity stage, TVS, and 1000 uF bulk capacitor together at one board edge.
2. Place each DRV8256P beside its motor connector. The OUT1 and OUT2 copper should be short, wide, and symmetric.
3. Give each exposed pad a solid ground landing and a compact via array into an uninterrupted ground plane.
4. Keep each driver's charge-pump loop and VM ceramic capacitor within a few millimetres of the pins.
5. Route motor and servo current on wide pours. Use a trace-width calculator with the actual copper weight, layer, ambient temperature, and acceptable rise.
6. Keep the RP2354B, crystal, USB pair, encoder buffer, and servo data circuit away from motor outputs.
7. Join logic ground and power ground with a continuous plane, but place parts so high current returns to the power connector without crossing the logic area.
8. Put ESD parts at connectors. The protected trace runs inward from the protector, never past it first.
9. Provide test points for `USB_5V`, `3V3`, `VMOTOR`, `DRV_SLEEP`, every fault line, and `SERVO_DATA`.

## Firmware plan

At reset, hardware holds `DRV_SLEEP` low and disables servo transmit. Firmware should follow this order:

1. Configure all `Mx_IN1` and `Mx_IN2` pins low.
2. Start the eight-input PIO quadrature decoder.
3. Configure the four fault inputs and motor-supply ADC.
4. Start PWM at 20 kHz with zero duty.
5. Verify that `VMOTOR_SENSE` matches the configured 6 V or 12 V profile.
6. Raise `DRV_SLEEP` only after checks pass.
7. Ramp commands and reject an instantaneous direction reversal.
8. On any fault, force all inputs low, lower `DRV_SLEEP`, log the channel, and require an explicit recovery command.

For the servo bus, disable the TX buffer before enabling the UART receiver. At 1 Mbit/s, switch the buffer to high impedance immediately after the final stop bit. A PIO implementation gives exact turnaround timing, although a UART plus GPIO direction control also works.

Use 64-bit encoder accumulators. Snapshot all four counts in one critical section so odometry does not combine different sample times.

## Decisions to keep

- Use RP2354B, not RP2350B plus external primary flash.
- Use four DRV8256P devices. One chip is one motor channel.
- Keep a fixed 2 A hardware current limit. Software limits are not a substitute.
- Buffer the 5 V encoders even though current A4 silicon has some 5 V-tolerant GPIOs.
- Keep USB power separate from actuator power.
- Let the external supply choose 6 V or 12 V. Do not hide an 8 A converter on this PCB.
- Power serial servos from the motor rail only when their rated voltage matches it.

## Sources

- [Raspberry Pi RP2350/RP2354 datasheet](https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf)
- [Raspberry Pi hardware design with RP2350](https://datasheets.raspberrypi.com/rp2350/hardware-design-with-rp2350.pdf)
- [Raspberry Pi RP2354 and A4 announcement](https://www.raspberrypi.com/news/rp2350-a4-rp2354-and-a-new-hacking-challenge/)
- [TI DRV8256 product page and datasheet](https://www.ti.com/product/DRV8256)
- [TI SN74LVC244A product page](https://www.ti.com/product/SN74LVC244A)
- [TI SN74LVC1G125 product page](https://www.ti.com/product/SN74LVC1G125)
- [TI SN74LVC1G17 product page](https://www.ti.com/product/SN74LVC1G17)
- [Waveshare bus-servo control reference circuit](https://files.waveshare.com/upload/d/d3/Bus_servo_control_circuit.pdf)
- [Feetech 7.4 V STS3215-C001 specifications](https://www.feetechrc.com/74v-19-kgcm-plastic-case-metal-tooth-magnetic-code-double-axis-ttl-series-steering-gear.html)
- [Feetech 12 V STS3215-C018 specifications](https://www.feetechrc.com/en/525603.html)
