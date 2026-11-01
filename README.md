# Spooder motor controller

This repository contains the KiCad work for a four-channel brushed motor controller. The proposed controller uses an RP2354B, four TI DRV8256P H-bridges, quadrature encoder inputs, USB-C device power, and a protected Feetech-style TTL serial-servo port.

The current KiCad sheets are still being edited. The design guide below is a reviewed target architecture, not a claim that the existing PCB already implements it.

## Design documents

- [Design guide](docs/rp2354-motor-controller/DESIGN_GUIDE.md)
- [Bill of materials](docs/rp2354-motor-controller/BOM.md)
- [RP2354B pin map](docs/rp2354-motor-controller/PIN_MAP.md)
- [Assembly and bring-up](docs/rp2354-motor-controller/ASSEMBLY_AND_BRINGUP.md)
- `docs/rp2354-motor-controller/SCHEMATIC.jsx` is the rendered architecture and reference-circuit sheet.

## Target specification

| Item | Target |
| --- | --- |
| MCU | RP2354B, QFN-80, 2 MB in-package flash |
| Brushed motors | 4 independent channels |
| Driver | 4 × DRV8256PRGER |
| Motor supply | External regulated 6 V or 12 V, 12.6 V maximum |
| Per-motor limit | 2.0 A nominal hardware chopping threshold |
| Encoders | 4 × 5 V quadrature Hall encoders |
| USB-C | USB 2.0 device and logic power only |
| Smart servos | Feetech/Waveshare ST/SC TTL half-duplex bus |

Do not power motors or servos from USB VBUS. USB ground and motor ground join on the controller, but their high-current return paths must stay separate until the power-entry star point.
