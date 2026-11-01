function App() {
  const C = {
    ink: '#15202b', muted: '#5d6975', wire: '#50616f', sig: '#1473e6',
    power: '#d64045', ground: '#16845b', purple: '#7656c9', panel: '#f7f9fb',
    edge: '#b8c2cc', dark: '#202830', driver: '#2f7357', logic: '#285f9b',
    motor: '#e9edf0', orange: '#c96a16', warn: '#fff3d6'
  };
  const Txt = ({ x, y, size = 13, color = C.ink, bold = false, anchor = 'start', children }) => (
    <text x={x} y={y} fontFamily="Inter, Arial, sans-serif" fontSize={size} fill={color}
      fontWeight={bold ? 700 : 400} textAnchor={anchor}>{children}</text>
  );
  const Mono = ({ x, y, size = 12, color = C.ink, bold = false, anchor = 'start', children }) => (
    <text x={x} y={y} fontFamily="Consolas, Menlo, monospace" fontSize={size} fill={color}
      fontWeight={bold ? 700 : 400} textAnchor={anchor}>{children}</text>
  );
  const Box = ({ x, y, w, h, fill = C.panel, stroke = C.edge, r = 8 }) => (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth="2" />
  );
  const Line = ({ x1, y1, x2, y2, color = C.wire, width = 2, dash }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
      strokeLinecap="round" strokeDasharray={dash} />
  );
  const Net = ({ x, y, name, color = C.sig, anchor = 'start' }) => (
    <Mono x={x} y={y} size={12} color={color} bold anchor={anchor}>{name}</Mono>
  );
  const Dot = ({ x, y, color = C.wire }) => <circle cx={x} cy={y} r="3.5" fill={color} />;
  const Gnd = ({ x, y }) => (
    <g stroke={C.ground} strokeWidth="2">
      <Line x1={x} y1={y} x2={x} y2={y + 9} color={C.ground} />
      <Line x1={x - 10} y1={y + 9} x2={x + 10} y2={y + 9} color={C.ground} />
      <Line x1={x - 6} y1={y + 14} x2={x + 6} y2={y + 14} color={C.ground} />
      <Line x1={x - 2} y1={y + 19} x2={x + 2} y2={y + 19} color={C.ground} />
    </g>
  );
  const Pin = ({ x, y, side = 'R', pin, net, color = C.sig }) => {
    const end = side === 'R' ? x + 36 : x - 36;
    return <g>
      <Mono x={side === 'R' ? x - 7 : x + 7} y={y + 4} size={10} color="#eaf0f5"
        anchor={side === 'R' ? 'end' : 'start'}>{pin}</Mono>
      <Line x1={x} y1={y} x2={end} y2={y} />
      <Net x={side === 'R' ? end + 6 : end - 6} y={y + 4} name={net} color={color}
        anchor={side === 'R' ? 'start' : 'end'} />
    </g>;
  };
  const Motor = ({ cx, cy, id }) => <g>
    <circle cx={cx} cy={cy} r="30" fill={C.motor} stroke="#7b8792" strokeWidth="2" />
    <Txt x={cx} y={cy + 7} size={22} bold anchor="middle">M{id}</Txt>
    <Txt x={cx} y={cy + 53} size={11} color={C.muted} anchor="middle">brushed DC, ≤2 A stall</Txt>
  </g>;
  const Driver = ({ y, id, inA, inB, fault, encA, encB }) => <g>
    <Box x={1220} y={y} w={330} h={145} fill={C.driver} stroke="#20523e" />
    <Txt x={1385} y={y + 24} size={15} color="white" bold anchor="middle">U{id + 1} · DRV8256PRGER · CHANNEL {id}</Txt>
    <Pin x={1220} y={y + 45} side="L" pin="IN1" net={inA} />
    <Pin x={1220} y={y + 70} side="L" pin="IN2" net={inB} />
    <Pin x={1220} y={y + 95} side="L" pin="nSLEEP" net="DRV_SLEEP" color={C.purple} />
    <Pin x={1220} y={y + 120} side="L" pin="nFAULT" net={fault} color={C.orange} />
    <Pin x={1550} y={y + 45} side="R" pin="VM" net="VMOTOR" color={C.power} />
    <Mono x={1538} y={y + 74} size={10} color="#eaf0f5" anchor="end">OUT1</Mono>
    <Mono x={1538} y={y + 104} size={10} color="#eaf0f5" anchor="end">OUT2</Mono>
    <Line x1={1550} y1={y + 70} x2={1630} y2={y + 70} />
    <Line x1={1550} y1={y + 100} x2={1630} y2={y + 100} />
    <Line x1={1630} y1={y + 70} x2={1630} y2={y + 56} />
    <Line x1={1630} y1={y + 100} x2={1630} y2={y + 114} />
    <Motor cx={1630} cy={y + 85} id={id} />
    <Box x={1705} y={y + 28} w={250} h={105} fill="#fff" stroke={C.edge} />
    <Txt x={1830} y={y + 50} size={12} bold anchor="middle">ENCODER {id}</Txt>
    <Mono x={1718} y={y + 72} size={11} color={C.power}>1  ENC_5V</Mono>
    <Mono x={1718} y={y + 92} size={11} color={C.ground}>2  GND</Mono>
    <Mono x={1718} y={y + 112} size={11} color={C.sig}>3  {encA}_5V</Mono>
    <Mono x={1830} y={y + 112} size={11} color={C.sig}>4  {encB}_5V</Mono>
  </g>;
  const drivers = [
    [250, 1, 'M1_IN1', 'M1_IN2', 'M1_FAULT_N', 'ENC1_A', 'ENC1_B'],
    [425, 2, 'M2_IN1', 'M2_IN2', 'M2_FAULT_N', 'ENC2_A', 'ENC2_B'],
    [600, 3, 'M3_IN1', 'M3_IN2', 'M3_FAULT_N', 'ENC3_A', 'ENC3_B'],
    [775, 4, 'M4_IN1', 'M4_IN2', 'M4_FAULT_N', 'ENC4_A', 'ENC4_B']
  ];
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1020" width="100%"
    style={{ display: 'block', background: '#ffffff' }}>
    <style>{`html,body{margin:0;background:#fff} text{letter-spacing:.05px}`}</style>
    <Txt x={45} y={43} size={25} bold>RP2354B four-motor encoder controller</Txt>
    <Txt x={45} y={68} size={13} color={C.muted}>USB-C logic power · external 6 V or 12 V actuator rail · four current-limited bridges · Feetech TTL bus</Txt>

    <Box x={40} y={105} w={255} h={145} fill="#eef5fc" stroke={C.logic} />
    <Txt x={167} y={132} size={16} bold anchor="middle">J1 · USB-C DEVICE</Txt>
    <Mono x={58} y={160}>CC1 → 5.1k → GND</Mono><Mono x={58} y={181}>CC2 → 5.1k → GND</Mono>
    <Mono x={58} y={202}>D+ / D- → ESD</Mono><Mono x={58} y={223}>VBUS → F1 500 mA · ENC_5V</Mono>
    <Line x1={295} y1={155} x2={350} y2={155} color={C.power} width={3} /><Net x={322} y={145} name="USB_5V" color={C.power} anchor="middle" />
    <Line x1={295} y1={215} x2={455} y2={215} color={C.sig} /><Net x={375} y={205} name="USB_D±" anchor="middle" />
    <Box x={350} y={110} w={210} h={90} fill="#eaf2ff" stroke={C.logic} />
    <Txt x={455} y={137} size={15} bold anchor="middle">U9 · TLV75533P</Txt>
    <Txt x={455} y={160} size={12} anchor="middle">5 V to 3.3 V · 500 mA</Txt>
    <Line x1={560} y1={155} x2={625} y2={155} color={C.power} width={3} /><Net x={592} y={145} name="3V3" color={C.power} anchor="middle" />

    <Box x={625} y={100} w={380} h={675} fill={C.dark} stroke="#11181f" />
    <Txt x={815} y={132} size={18} color="white" bold anchor="middle">U1 · RP2354B · QFN-80</Txt>
    <Txt x={815} y={153} size={12} color="#cbd6df" anchor="middle">2 MB in-package flash · 48 GPIO · A4 stepping</Txt>
    <Pin x={625} y={190} side="L" pin="USB_DP/DM" net="USB_D±" />
    <Pin x={625} y={222} side="L" pin="IOVDD" net="3V3" color={C.power} />
    <Pin x={625} y={254} side="L" pin="ADC0" net="VMOTOR_SENSE" color={C.orange} />
    <Txt x={815} y={293} size={12} color="#aebbc6" bold anchor="middle">MOTOR PWM · GPIO0…7</Txt>
    {['M1_IN1','M1_IN2','M2_IN1','M2_IN2','M3_IN1','M3_IN2','M4_IN1','M4_IN2'].map((n,i)=><Pin key={n} x={1005} y={315+i*25} side="R" pin={`GPIO${i}`} net={n} />)}
    <Txt x={815} y={540} size={12} color="#aebbc6" bold anchor="middle">FAULTS · ENCODERS · SERVO</Txt>
    {['M1_FAULT_N','M2_FAULT_N','M3_FAULT_N','M4_FAULT_N','DRV_SLEEP'].map((n,i)=><Pin key={n} x={1005} y={560+i*25} side="R" pin={i<4?`GPIO${8+i}`:'GPIO23'} net={n} color={i<4?C.orange:C.purple} />)}
    <Mono x={648} y={720} size={11} color="#cbd6df">12 MHz crystal · SWD · RUN · BOOTSEL</Mono>
    <Mono x={648} y={742} size={11} color="#cbd6df">QSPI pins: no stubs; internal flash shares bus</Mono>

    <Box x={40} y={315} w={260} h={190} fill="#fff5ee" stroke={C.orange} />
    <Txt x={170} y={342} size={16} bold anchor="middle">J2 · ACTUATOR POWER</Txt>
    <Txt x={170} y={368} size={13} anchor="middle">External regulated 6 V or 12 V</Txt>
    <Mono x={58} y={400}>F2  10…15 A fuse</Mono><Mono x={58} y={423}>Q1  reverse polarity</Mono>
    <Mono x={58} y={446}>D1  SMBJ15A TVS</Mono><Mono x={58} y={469}>C1  1000 µF / 25 V</Mono>
    <Line x1={300} y1={385} x2={520} y2={385} color={C.power} width={4} />
    <Net x={410} y={375} name="VMOTOR" color={C.power} anchor="middle" />
    <Gnd x={170} y={482} />

    <Box x={45} y={560} w={510} h={200} fill="#f3effc" stroke={C.purple} />
    <Txt x={300} y={588} size={16} bold anchor="middle">FEETECH / WAVESHARE TTL HALF-DUPLEX BUS</Txt>
    <Box x={68} y={615} w={185} h={95} fill="#fff" stroke={C.purple} />
    <Txt x={160} y={640} size={13} bold anchor="middle">U7 · LVC1G125</Txt>
    <Mono x={82} y={664}>SERVO_TX → DATA</Mono><Mono x={82} y={686}>OE = TX_EN_N</Mono>
    <Box x={285} y={615} w={185} h={95} fill="#fff" stroke={C.purple} />
    <Txt x={377} y={640} size={13} bold anchor="middle">U8 · LVC1G17</Txt>
    <Mono x={299} y={664}>DATA → SERVO_RX</Mono><Mono x={299} y={686}>5.5 V tolerant · 10k idle pull-up</Mono>
    <Line x1={253} y1={662} x2={285} y2={662} color={C.purple} width={3} /><Dot x={269} y={662} color={C.purple} />
    <Net x={269} y={650} name="SERVO_DATA" color={C.purple} anchor="middle" />
    <Box x={68} y={725} w={402} h={52} fill="#fff" stroke={C.edge} />
    <Mono x={85} y={747} color={C.purple}>J11/J12:  1 DATA   2 SERVO_V+   3 GND</Mono>
    <Mono x={85} y={768} color={C.power}>SERVO_V+ = fused VMOTOR through removable link</Mono>

    <Box x={45} y={820} w={510} h={125} fill={C.warn} stroke="#d6a33b" />
    <Txt x={300} y={848} size={15} bold anchor="middle">POWER RULE</Txt>
    <Txt x={70} y={875} size={13}>6 V rail: use only 6 V or 7.4 V-class servos.</Txt>
    <Txt x={70} y={898} size={13}>12 V rail: use only the 12 V servo variant.</Txt>
    <Txt x={70} y={921} size={13} bold>USB never powers motors or servos.</Txt>

    <Box x={625} y={815} w={380} h={130} fill="#eef5fc" stroke={C.logic} />
    <Txt x={815} y={842} size={15} bold anchor="middle">U6 · SN74LVC244A · 3.3 V</Txt>
    <Txt x={815} y={866} size={12} anchor="middle">8 × 5 V-tolerant, power-off-protected inputs</Txt>
    <Mono x={650} y={892}>ENC1_A/B … ENC4_A/B  →  GPIO12…19</Mono>
    <Mono x={650} y={916}>100 Ω/input · both OE_N pins grounded</Mono>

    {drivers.map(d => <Driver key={d[1]} y={d[0]} id={d[1]} inA={d[2]} inB={d[3]} fault={d[4]} encA={d[5]} encB={d[6]} />)}

    <Txt x={1220} y={110} size={14} bold>Each driver gets its own local parts</Txt>
    <Mono x={1220} y={134} size={11}>100 µF + 10 nF on VM · 22 nF CPH-CPL · 220 nF VCP-VM</Mono>
    <Mono x={1220} y={154} size={11}>470 nF on DVDD · VREF 1.316 V → ITRIP ≈ 1.99 A · exposed pad to GND</Mono>

    <Txt x={45} y={992} size={11} color={C.muted}>Reference architecture sheet. Component-level values and package pin numbers are in DESIGN_GUIDE.md and PIN_MAP.md.</Txt>
  </svg>;
}
