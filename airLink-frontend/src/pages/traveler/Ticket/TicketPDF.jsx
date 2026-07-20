import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

// ── A4 B&W minimal ticket styles ──────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#111111',
    backgroundColor: '#ffffff',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
  },

  // ── header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  airlineBox: {
    borderWidth: 1,
    borderColor: '#111111',
    padding: '4 6',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  headerTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  headerSub: { fontSize: 7, color: '#888888', letterSpacing: 1.5, marginTop: 1 },
  statusBox: {
    borderWidth: 1,
    borderColor: '#111111',
    padding: '3 7',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // ── PNR row ──
  pnrRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 10,
  },
  pnrCell: {
    flex: 1,
    padding: '6 10',
    borderRightWidth: 1,
    borderRightColor: '#dddddd',
  },
  pnrCellLast: { flex: 1, padding: '6 10' },
  pnrLabel: { fontSize: 7, color: '#888888', letterSpacing: 1.5, marginBottom: 2 },
  pnrValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },

  // ── route ──
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 14,
    marginBottom: 10,
  },
  routeSide: { width: '38%' },
  routeSideRight: { width: '38%', alignItems: 'flex-end' },
  bigTime: { fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: -0.5 },
  bigCode: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  routeMeta: { fontSize: 8, color: '#666666', marginTop: 3 },
  routeMiddle: { flex: 1, alignItems: 'center' },
  durationText: { fontSize: 8, color: '#888888', fontFamily: 'Helvetica-Oblique' },

  // ── passenger table ──
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
  },
  colName: { width: '40%', fontSize: 8, color: '#888888', letterSpacing: 1 },
  colType: { width: '20%', fontSize: 8, color: '#888888', letterSpacing: 1 },
  colSeat: { width: '20%', fontSize: 8, color: '#888888', letterSpacing: 1 },
  colClass: { width: '20%', fontSize: 8, color: '#888888', letterSpacing: 1 },
  cellName:  { width: '40%', fontSize: 10, fontFamily: 'Helvetica-Bold' },
  cellType:  { width: '20%', fontSize: 9, color: '#444444' },
  cellSeat:  { width: '20%', fontSize: 10, fontFamily: 'Helvetica-Bold' },
  cellClass: { width: '20%', fontSize: 9, color: '#444444' },

  sectionLabel: {
    fontSize: 7,
    color: '#888888',
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 10,
  },

  // ── detail grid ──
  detailGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 10,
  },
  detailCell: {
    flex: 1,
    padding: '8 10',
    borderRightWidth: 1,
    borderRightColor: '#dddddd',
  },
  detailCellLast: { flex: 1, padding: '8 10' },
  detailLabel: { fontSize: 7, color: '#888888', letterSpacing: 1.5, marginBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  detailKey: { fontSize: 8, color: '#888888' },
  detailVal: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc',
    marginTop: 3,
    paddingTop: 3,
  },
  totalKey: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  totalVal: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // ── perforation line ──
  perf: {
    borderTopWidth: 1,
    borderTopColor: '#aaaaaa',
    borderTopStyle: 'dashed',
    marginVertical: 12,
  },

  // ── bottom stub ──
  stub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stubText: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  stubMeta: { fontSize: 8, color: '#666666', marginBottom: 1 },
  qrBox: {
    borderWidth: 1,
    borderColor: '#cccccc',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: { fontSize: 7, color: '#aaaaaa', letterSpacing: 1 },

  // ── footer ──
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    marginTop: 14,
    paddingTop: 6,
    fontSize: 7,
    color: '#aaaaaa',
    lineHeight: 1.6,
  },
})

// ── helpers ──────────────────────────────────────────────────────────
const fmtTime = (dt) =>
  dt ? new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'

const fmtDateLong = (dt) =>
  dt ? new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const fmtDateShort = (dt) =>
  dt ? new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ── PDF Document ──────────────────────────────────────────────────────
const TicketPDFDocument = ({ booking }) => {
  const baseFare = booking.fareBaseFare    || 0
  const taxes    = booking.fareTaxesAndFees || 0
  const fees     = booking.fareAirlineFees  || 0
  const total    = booking.totalAmount      || (baseFare + taxes + fees)

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.airlineBox}>
              <Text>{(booking.flightName || 'AIRLINE').toUpperCase()}</Text>
            </View>
            <View>
              <Text style={s.headerTitle}>Electronic Ticket &amp; Itinerary</Text>
              <Text style={s.headerSub}>BOARDING PASS / E-TICKET RECEIPT</Text>
            </View>
          </View>
          <View style={s.statusBox}>
            <Text>{(booking.status || 'CONFIRMED').toUpperCase()}</Text>
          </View>
        </View>

        {/* ── PNR / REF ROW ── */}
        <View style={s.pnrRow}>
          {[
            ['PNR / BOOKING REF', booking.bookingReference || '—'],
            ['FLIGHT',            booking.flightNumber     || '—'],
            ['CLASS',             booking.fareName         || 'Economy'],
            ['BOOKING DATE',      fmtDateShort(booking.bookingDate)],
          ].map(([label, value], i, arr) => (
            <View key={label} style={i === arr.length - 1 ? s.pnrCellLast : s.pnrCell}>
              <Text style={s.pnrLabel}>{label}</Text>
              <Text style={s.pnrValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── FLIGHT ROUTE ── */}
        <View style={s.routeBox}>
          {/* Departure */}
          <View style={s.routeSide}>
            <Text style={s.bigTime}>{fmtTime(booking.departureTime)}</Text>
            <Text style={s.bigCode}>{booking.departureAirport || '—'}</Text>
            <Text style={s.routeMeta}>{fmtDateLong(booking.departureTime)}</Text>
            {(booking.departureTerminal || booking.departureGate) && (
              <Text style={s.routeMeta}>
                {booking.departureTerminal ? `Terminal ${booking.departureTerminal}` : ''}
                {booking.departureGate ? `  ·  Gate ${booking.departureGate}` : ''}
              </Text>
            )}
          </View>

          {/* Centre */}
          <View style={s.routeMiddle}>
            <Text style={s.durationText}>{booking.flightDuration || '—'}</Text>
          </View>

          {/* Arrival */}
          <View style={s.routeSideRight}>
            <Text style={s.bigTime}>{fmtTime(booking.arrivalTime)}</Text>
            <Text style={s.bigCode}>{booking.arrivalAirport || '—'}</Text>
            <Text style={s.routeMeta}>{fmtDateLong(booking.arrivalTime)}</Text>
            {(booking.arrivalTerminal || booking.arrivalGate) && (
              <Text style={s.routeMeta}>
                {booking.arrivalTerminal ? `Terminal ${booking.arrivalTerminal}` : ''}
                {booking.arrivalGate ? `  ·  Gate ${booking.arrivalGate}` : ''}
              </Text>
            )}
          </View>
        </View>

        {/* ── PASSENGERS ── */}
        <Text style={s.sectionLabel}>PASSENGER(S)</Text>
        <View style={s.tableHeader}>
          <Text style={s.colName}>NAME</Text>
          <Text style={s.colType}>TYPE</Text>
          <Text style={s.colSeat}>SEAT</Text>
          <Text style={s.colClass}>CLASS</Text>
        </View>
        {(booking.passengers || []).map((p, i) => {
          const seat = booking.seatInstances?.[i]
          const name = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || '—'
          return (
            <View key={i} style={s.tableRow}>
              <Text style={s.cellName}>{name}</Text>
              <Text style={s.cellType}>{p.isAdult !== undefined ? (p.isAdult ? 'Adult' : 'Child') : 'Adult'}</Text>
              <Text style={s.cellSeat}>{seat?.seatNumber || '—'}</Text>
              <Text style={s.cellClass}>{seat?.seatType || booking.fareName || 'Economy'}</Text>
            </View>
          )
        })}

        {/* ── BAGGAGE · CONTACT · FARE ── */}
        <Text style={s.sectionLabel}>DETAILS</Text>
        <View style={s.detailGrid}>

          {/* Baggage */}
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>BAGGAGE</Text>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Cabin</Text>
              <Text style={s.detailVal}>
                {booking.cabinBaggageAllowance ? `${booking.cabinBaggageAllowance} kg` : '7 kg'}
              </Text>
            </View>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Check-in</Text>
              <Text style={s.detailVal}>
                {booking.checkinBaggageAllowance ? `${booking.checkinBaggageAllowance} kg` : '15 kg'}
              </Text>
            </View>
          </View>

          {/* Contact */}
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>CONTACT</Text>
            <Text style={[s.detailKey, { marginBottom: 2 }]}>{booking.contactInfo?.email || '—'}</Text>
            <Text style={s.detailKey}>{booking.contactInfo?.phone || '—'}</Text>
          </View>

          {/* Fare */}
          <View style={s.detailCellLast}>
            <Text style={s.detailLabel}>FARE</Text>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Base Fare</Text>
              <Text style={s.detailVal}>₹{baseFare.toLocaleString()}</Text>
            </View>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Taxes</Text>
              <Text style={s.detailVal}>₹{taxes.toLocaleString()}</Text>
            </View>
            {fees > 0 && (
              <View style={s.detailRow}>
                <Text style={s.detailKey}>Fees</Text>
                <Text style={s.detailVal}>₹{fees.toLocaleString()}</Text>
              </View>
            )}
            <View style={s.totalRow}>
              <Text style={s.totalKey}>Total</Text>
              <Text style={s.totalVal}>₹{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* ── PERFORATION LINE ── */}
        <View style={s.perf} />

        {/* ── BOTTOM STUB ── */}
        <View style={s.stub}>
          <View>
            <Text style={s.stubText}>
              {booking.departureAirport} → {booking.arrivalAirport}
            </Text>
            <Text style={s.stubMeta}>
              {booking.passengers?.[0]?.fullName || 'Passenger'}
              {booking.seatInstances?.[0]?.seatNumber
                ? `   Seat ${booking.seatInstances[0].seatNumber}`
                : ''}
            </Text>
            <Text style={s.stubMeta}>
              {fmtDateLong(booking.departureTime)}  ·  {fmtTime(booking.departureTime)}
            </Text>
            <Text style={[s.stubMeta, { marginTop: 3, fontFamily: 'Helvetica-Bold' }]}>
              {booking.bookingReference || '—'}
            </Text>
          </View>
          <View style={s.qrBox}>
            <Text style={s.qrText}>QR</Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <Text style={s.footer}>
          This is a computer-generated e-ticket and does not require a physical signature. Carry valid photo ID at the airport.
          Arrive 2 hrs before departure for domestic flights. Boarding closes 25 min before departure.
          Subject to terms &amp; conditions of {booking.flightName || 'the carrier'}.
        </Text>

      </Page>
    </Document>
  )
}

// ── export: generate + trigger download ──────────────────────────────
export const generateTicketPDF = async (booking) => {
  const blob = await pdf(<TicketPDFDocument booking={booking} />).toBlob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `E-Ticket-${booking.bookingReference || booking.id}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return { success: true }
}

export default TicketPDFDocument
