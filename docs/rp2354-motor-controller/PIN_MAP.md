# RP2354B pin map

This allocation keeps each motor's two PWM inputs on adjacent GPIOs, places all eight encoder inputs in one contiguous group, and reserves a normal UART pair for the Feetech bus. Package-pad numbers match the RP2350B and RP2354B QFN-80 pinout.

## Assigned GPIOs

| RP2354B pad | GPIO | Net | Direction | Function and reset rule |
| ---: | ---: | --- | --- | --- |
| 77 | 0 | `M1_IN1` | Output | Motor 1 bridge input. Reset low. |
| 78 | 1 | `M1_IN2` | Output | Motor 1 bridge input. Reset low. |
| 79 | 2 | `M2_IN1` | Output | Motor 2 bridge input. Reset low. |
| 80 | 3 | `M2_IN2` | Output | Motor 2 bridge input. Reset low. |
| 1 | 4 | `M3_IN1` | Output | Motor 3 bridge input. Reset low. |
| 2 | 5 | `M3_IN2` | Output | Motor 3 bridge input. Reset low. |
| 3 | 6 | `M4_IN1` | Output | Motor 4 bridge input. Reset low. |
| 4 | 7 | `M4_IN2` | Output | Motor 4 bridge input. Reset low. |
| 6 | 8 | `M1_FAULT_N` | Input | Open-drain fault, 10 kOhm pull-up to 3.3 V. |
| 7 | 9 | `M2_FAULT_N` | Input | Open-drain fault, 10 kOhm pull-up to 3.3 V. |
| 8 | 10 | `M3_FAULT_N` | Input | Open-drain fault, 10 kOhm pull-up to 3.3 V. |
| 9 | 11 | `M4_FAULT_N` | Input | Open-drain fault, 10 kOhm pull-up to 3.3 V. |
| 11 | 12 | `ENC1_A` | Input | 3.3 V output from encoder buffer. |
| 12 | 13 | `ENC1_B` | Input | 3.3 V output from encoder buffer. |
| 13 | 14 | `ENC2_A` | Input | 3.3 V output from encoder buffer. |
| 14 | 15 | `ENC2_B` | Input | 3.3 V output from encoder buffer. |
| 16 | 16 | `ENC3_A` | Input | 3.3 V output from encoder buffer. |
| 17 | 17 | `ENC3_B` | Input | 3.3 V output from encoder buffer. |
| 18 | 18 | `ENC4_A` | Input | 3.3 V output from encoder buffer. |
| 19 | 19 | `ENC4_B` | Input | 3.3 V output from encoder buffer. |
| 20 | 20 | `SERVO_TX` | Output | UART1 TX or PIO TX. Reset low. |
| 21 | 21 | `SERVO_RX` | Input | Output of power-off-protected Schmitt receiver. |
| 22 | 22 | `SERVO_TX_EN_N` | Output | Active-low TX enable. External 10 kOhm pull-up disables TX. |
| 23 | 23 | `DRV_SLEEP` | Output | Shared active-high driver wake. External 100 kOhm pull-down. |
| 25 | 24 | `I2C0_SDA` | Bidirectional | Expansion I2C, 2.2 kOhm pull-up if populated. |
| 26 | 25 | `I2C0_SCL` | Output | Expansion I2C, 2.2 kOhm pull-up if populated. |
| 27 | 26 | `STATUS_LED` | Output | Low-current status LED. |
| 28 | 27 | `USER_BUTTON` | Input | Button to ground, internal or external pull-up. |
| 36 | 28 | `EXP_GPIO28` | Bidirectional | Expansion header. |
| 37 | 29 | `EXP_GPIO29` | Bidirectional | Expansion header. |
| 38 | 30 | `EXP_GPIO30` | Bidirectional | Expansion header. |
| 39 | 31 | `EXP_GPIO31` | Bidirectional | Expansion header. |
| 40 | 32 | `EXP_GPIO32` | Bidirectional | Expansion header. |
| 42 | 33 | `EXP_GPIO33` | Bidirectional | Expansion header. |
| 43 | 34 | `EXP_GPIO34` | Bidirectional | Expansion header. |
| 44 | 35 | `EXP_GPIO35` | Bidirectional | Expansion header. |
| 45 | 36 | `EXP_GPIO36` | Bidirectional | Expansion header. |
| 46 | 37 | `EXP_GPIO37` | Bidirectional | Expansion header. |
| 47 | 38 | `EXP_GPIO38` | Bidirectional | Expansion header. |
| 48 | 39 | `EXP_GPIO39` | Bidirectional | Expansion header. |
| 49 | 40 / ADC0 | `VMOTOR_SENSE` | Analog input | Divider sized for at least 15 V input plus margin. |
| 52 | 41 / ADC1 | `USB_5V_SENSE` | Analog input | Divider monitors VBUS after fuse. |
| 53 | 42 / ADC2 | `EXP_ADC2` | Analog input | Expansion, 0 V to ADC_AVDD only. |
| 54 | 43 / ADC3 | `EXP_ADC3` | Analog input | Expansion, 0 V to ADC_AVDD only. |
| 55 | 44 / ADC4 | `EXP_ADC4` | Analog input | Expansion, 0 V to ADC_AVDD only. |
| 56 | 45 / ADC5 | `EXP_ADC5` | Analog input | Expansion, 0 V to ADC_AVDD only. |
| 57 | 46 / ADC6 | `EXP_ADC6` | Analog input | Expansion, 0 V to ADC_AVDD only. |
| 58 | 47 / ADC7 | `EXP_ADC7` | Analog input | Expansion, 0 V to ADC_AVDD only. |

## Dedicated and power pins

| RP2354B pad or pads | Pin name | Net | Requirement |
| --- | --- | --- | --- |
| 66 | `USB_DM` | `USB_D_N` | Route as 90 ohm differential pair with USB_DP. |
| 67 | `USB_DP` | `USB_D_P` | Route as 90 ohm differential pair with USB_DM. |
| 33 | `SWCLK` | `SWCLK` | SWD header. Do not add a large capacitive load. |
| 34 | `SWD` | `SWDIO` | SWD header. |
| 35 | `RUN` | `RUN_N` | Reset button to ground; follow Raspberry Pi reference. |
| 30, 31 | `XIN`, `XOUT` | `XIN`, `XOUT` | 12 MHz crystal network from the current reference design. |
| 75 | `QSPI_SS` | `BOOTSEL_N` | Short connection to BOOTSEL button only. |
| 70 to 74 | QSPI data and clock | Internal flash bus | No long traces or test pads. RP2354B's flash shares these pads. |
| 69 | `QSPI_IOVDD` | `3V3` | Must be 3.3 V for RP2354. Decouple at pin. |
| 5, 15, 24, 29, 41, 50, 60, 76 | `IOVDD` | `3V3` | 100 nF at each supply pin group. |
| 10, 32, 51 | `DVDD` | `1V1` | Core rail from internal regulator. Follow reference decoupling. |
| 59 | `ADC_AVDD` | `3V3_ADC` | Filtered analog supply from 3.3 V. |
| 61 | `VREG_AVDD` | `3V3` | Internal regulator analog supply. Follow reference layout. |
| 62 | `VREG_PGND` | `GND` | Keep regulator current loop compact. |
| 63 | `VREG_LX` | `VREG_LX` | 3.3 uH polarised inductor circuit from reference design. |
| 64 | `VREG_VIN` | `3V3` | Internal core-regulator input. |
| 65 | `VREG_FB` | `1V1` | Kelvin-route as shown in Raspberry Pi reference layout. |
| 68 | `USB_OTP_VDD` | `3V3` | Decouple per the current reference design. |
| 81 | Exposed pad | `GND` | Solid ground connection and thermal vias. |

## Pin cautions

- GPIO40 through GPIO47 are ADC-capable pins. They are not part of the digital 5 V-tolerant group. Keep every ADC signal within the ADC supply range.
- Even where the A4 datasheet permits 5 V digital inputs, IOVDD must be powered before applying 5 V. The encoder buffer removes that sequencing trap.
- The QSPI pins are active high-speed flash signals inside RP2354B. Extra copper becomes a stub and an antenna.
- `DRV_SLEEP` must stay low until all eight motor inputs are configured.
- `SERVO_TX_EN_N` needs a real external pull-up. Relying on an MCU reset default can make the servo bus fight another transmitter.
