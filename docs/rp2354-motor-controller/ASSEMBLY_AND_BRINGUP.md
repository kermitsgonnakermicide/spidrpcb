# Assembly and bring-up

## Before ordering the PCB

- Run ERC and DRC with no unreviewed errors.
- Confirm the root sheet points to a real motor-driver sheet. The current project contains a hierarchy entry named "motor drivin" that points to `pwr_usb.kicad_sch`; fix that before using the project for manufacture.
- Replace the RP2350B value with RP2354B and remove any external primary-flash circuit.
- Compare the MCU power, crystal, inductor, USB, RUN, SWD, and BOOTSEL sections against Raspberry Pi's current RP2350B Minimal KiCad archive.
- Verify the DRV8256P footprint against TI's RGE-24 drawing. Pin 25 is the exposed pad.
- Check every connector from the mating side and board side. Servo harness polarity is an expensive place to mirror a footprint.
- Review current rating for the input connector, fuse holder, servo link, motor connectors, and copper pours.
- Put the actual expected motor and servo currents into a power budget.

## Assembly order

1. Assemble only the USB-C input, ESD array, 3.3 V regulator, MCU power components, crystal, SWD, RUN, and BOOTSEL circuits.
2. Inspect QFN solder joints and exposed pads with X-ray if the assembler offers it.
3. Power from a current-limited USB source. Do not connect motor power yet.
4. Confirm 5 V after F1, 3.3 V at every IOVDD group, 1.1 V at DVDD, and a 12 MHz waveform with a low-capacitance probe if debugging requires it.
5. Load a USB and GPIO test image through BOOTSEL, then confirm SWD access.
6. Assemble U6 and test every encoder input with a 0 V to 5 V signal generator before connecting real encoders.
7. Assemble the servo data buffers with the servo power link removed. Verify UART echo and high-impedance turnaround on an oscilloscope.
8. Assemble one DRV8256P channel. Test it fully before populating the other three.
9. Populate the remaining driver channels, input protection, and bulk capacitors.

## First motor-channel test

Use a bench supply at 6 V with a 300 mA current limit and no motor connected.

1. Keep `DRV_SLEEP` low. Confirm OUT1 and OUT2 are high impedance.
2. Confirm DVDD is off or inactive in sleep as described by TI.
3. Raise the supply current limit enough for the driver logic, then raise `DRV_SLEEP`.
4. Measure approximately 5 V at DVDD and about 1.32 V at both tied VREF pins.
5. Confirm `M1_FAULT_N` remains high.
6. Set IN1 and IN2 low. Both outputs should be low.
7. Exercise forward and reverse at 5 percent duty into a small unloaded motor.
8. Check the current-limit waveform with a current probe or a suitable series shunt used only for test.
9. Repeat at 12 V before connecting the intended motor.

Do not begin with a gearbox under load. A wiring mistake at full supply can destroy a motor, connector, or mechanism before the fuse clears.

## Encoder test

With USB power on and motor power off:

1. Apply 0 V and 5 V to each connector A and B pin through 1 kOhm.
2. Confirm the corresponding RP2354B pin switches between valid 0 V and 3.3 V levels.
3. Remove USB power while leaving the 5 V test signal applied. Check that the unpowered 3.3 V rail does not rise through the buffer.
4. Connect one encoder and rotate the shaft by hand.
5. Confirm A and B are square waves and the count sign changes when rotation reverses.
6. Record counts per motor-shaft revolution and gearbox-output revolution. Do not assume the seller's headline CPR uses the same definition as the firmware.

## Servo-bus test

Start with the removable servo power link open.

1. Scope `SERVO_DATA` while sending a packet. It should idle high, switch cleanly, and return to high impedance immediately after the final stop bit.
2. Confirm `SERVO_RX` receives the transmitted echo.
3. Power one servo from a separate current-limited supply set to its rated voltage.
4. Join grounds, then connect only DATA. Read the servo ID and voltage register.
5. Remove power, install the board's servo power link, and reconnect the servo normally.
6. Increase the current limit only after reads and low-torque moves work.

The 6 V and 12 V STS3215 variants are different products. Check the label before installing the servo power link.

## Full-load test

- Fit thermocouples or use a thermal camera on all four DRV8256P packages, the reverse-polarity MOSFET, input connector, fuse, and high-current joints.
- Run one motor at a time, then two, then four.
- Test the actual mechanical load at the highest ambient temperature expected.
- Measure VMOTOR droop and overshoot at the board connector and at the farthest driver.
- Perform a controlled deceleration and direction reversal while watching VMOTOR for regeneration.
- Stop if any connector or copper area exceeds its rating, if a driver repeatedly enters thermal shutdown, or if USB disconnects under motor transients.

## Firmware acceptance tests

- Outputs stay off during reset, BOOTSEL, debugger halt, and firmware crash.
- A fault on one channel stops all motion unless the product safety analysis explicitly allows independent continuation.
- Encoder counts remain correct at maximum no-load speed on all four motors together.
- The USB link survives four-motor starts and braking events.
- Servo replies remain valid while motor PWM is active.
- A command timeout ramps motors to zero and disables torque.
- The configured power profile rejects a measured rail outside its allowed 6 V or 12 V window.

## Existing-project review notes

These findings came from a read-only inspection of the current workspace. No existing KiCad file was changed by this guide work.

- The top-level motor-driver hierarchy entry currently references `pwr_usb.kicad_sch`, not a motor-driver sheet.
- `_autosave-motordrivin.kicad_sch` exists, which suggests unsaved or recovered motor-driver work. Resolve it in KiCad rather than copying it blindly.
- The MCU sheet currently identifies U2 as `RP2350_80QFN`. RP2354B is pin-compatible, but its QSPI supply must be 3.3 V and the external primary flash should be omitted.
- The USB/power sheet currently uses an NCP1117-3.3. The proposed TLV75533P is a better fit for USB-powered logic because it needs less dropout and does not depend on the older regulator's capacitor constraints.
- The repository has active KiCad lock files. Close KiCad and save or discard those edits intentionally before editing the schematic files with another tool.
