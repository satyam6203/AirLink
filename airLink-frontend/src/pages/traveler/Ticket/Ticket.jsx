import * as React from "react"
import { useRef } from "react"
import {
  Plane,
  ArrowLeft,
  Printer,
  AlertCircle,
  Home,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getBookingById } from "@/Redux/booking/bookingThunk"
import { Avatar } from "@/components/ui/avatar"

const Ticket = () => {
  const { bookingId } = useParams()
  const navigate      = useNavigate()
  const dispatch      = useDispatch()
  const { booking, loading, error } = useSelector((state) => state.booking)
  const ticketRef = useRef(null)

  useEffect(() => {
    if (bookingId) dispatch(getBookingById(bookingId))
  }, [bookingId, dispatch])

  // ── Print only the ticket div ─────────────────────────────────────
  const handlePrint = () => {
    const content = ticketRef.current
    if (!content) return

    const printWindow = window.open("", "_blank", "width=900,height=1200")
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>airlink-flight-ticket</title>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body  { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${content.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const fmt = {
    time:     (dt) => dt ? new Date(dt).toLocaleTimeString("en-US",  { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--",
    date:     (dt) => dt ? new Date(dt).toLocaleDateString("en-GB",  { day: "2-digit", month: "short", year: "numeric" }) : "—",
    dateLong: (dt) => dt ? new Date(dt).toLocaleDateString("en-GB",  { day: "numeric", month: "long",  year: "numeric" }) : "—",
  }

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600 mx-auto" />
        <p className="text-sm text-gray-500 tracking-wide">Loading ticket…</p>
      </div>
    </div>
  )

  /* ── error ── */
  if (error || !booking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-10 max-w-sm w-full text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-gray-400 mx-auto" />
        <p className="font-semibold text-gray-800">Ticket not found</p>
        <p className="text-xs text-gray-400">{error || "We couldn't load this booking."}</p>
        <Button variant="outline" onClick={() => navigate("/bookings")} className="w-full gap-2 text-sm">
          <Home className="h-4 w-4" /> Back to Bookings
        </Button>
      </div>
    </div>
  )

  const baseFare = booking.fareBaseFare     || 0
  const taxes    = booking.fareTaxesAndFees || 0
  const fees     = booking.fareAirlineFees  || 0
  const total    = booking.totalAmount      || (baseFare + taxes + fees)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">

      {/* ── Toolbar ── */}
      <div className="w-[794px] max-w-full mx-auto mb-5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-sm border border-gray-300 bg-white hover:bg-gray-50 px-4 py-1.5 rounded transition-colors"
        >
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TICKET — fixed A4 size: 794 × 1123 px (210 × 297 mm @ 96dpi)
          This exact div is screenshotted for the PDF.
      ══════════════════════════════════════════════════════════════ */}
      <div
        ref={ticketRef}
        className="w-[794px] min-h-[1123px] mx-auto bg-white border border-gray-300 shadow-sm"
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-10 pt-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="border border-gray-800 rounded p-1.5">
              <Plane className="h-5 w-5 text-gray-800" />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-tight leading-none text-gray-900">
                {booking.airlineName || "AirLink"}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400 leading-none mb-0.5">
                {booking.flightName || "Airline"}
              </div>
              
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Status</div>
            <div className="text-[11px] font-bold uppercase tracking-wider border border-gray-900 px-2.5 py-0.5 inline-block text-gray-900">
              {booking.status || "CONFIRMED"}
            </div>
          </div>
        </div>

        {/* ── PNR / REF ROW ── */}
        <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200 text-center">
          {[
            ["PNR",    booking.bookingReference || "—"],
            ["Flight", booking.flightNumber     || "—"],
            ["Class",  booking.fareName         || "Economy"],
            ["Date",   fmt.date(booking.bookingDate)],
          ].map(([label, value]) => (
            <div key={label} className="py-3.5 px-4">
              <div className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-1.5">{label}</div>
              <div className="text-[13px] font-bold font-mono tracking-wide text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {/* ── FLIGHT ROUTE ── */}
        <div className="px-10 py-8 border-b border-gray-200">
          <div className="flex items-center justify-between">

            {/* Departure */}
            <div className="w-[38%]">
              <div className="text-[14px] font-black text-gray-900 leading-none tracking-tight">
                {fmt.time(booking.departureTime)}
              </div>
              <div className="text-[13px] font-bold text-gray-800 leading-none mt-1.5 tracking-tight">
                {booking.departureAirport}
              </div>
              <div className="mt-2.5 space-y-1">
                <div className="text-[11px] text-gray-500">{fmt.dateLong(booking.departureTime)}</div>
                {(booking.departureTerminal || booking.departureGate) && (
                  <div className="text-[11px] text-gray-400">
                    {booking.departureTerminal && `Terminal ${booking.departureTerminal}`}
                    {booking.departureGate && ` · Gate ${booking.departureGate}`}
                  </div>
                )}
              </div>
            </div>

            {/* Centre */}
            <div className="flex-1 flex flex-col items-center gap-2 px-6">
              <div className="w-full flex items-center gap-1">
                <div className="h-2 w-2 rounded-full border-2 border-gray-400 shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                  <Plane className="absolute -top-[10px] left-1/2 -translate-x-1/2 h-5 w-5 text-gray-500 bg-white px-0.5" />
                </div>
                <div className="h-2 w-2 rounded-full bg-gray-700 shrink-0" />
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">
                {booking.flightDuration || "—"}
              </div>
            </div>

            {/* Arrival */}
            <div className="w-[38%] text-right">
              <div className="text-[14px] font-black text-gray-900 leading-none tracking-tight">
                {fmt.time(booking.arrivalTime)}
              </div>
              <div className="text-[13px] font-bold text-gray-800 leading-none mt-1.5 tracking-tight">
                {booking.arrivalAirport}
              </div>
              <div className="mt-2.5 space-y-1">
                <div className="text-[11px] text-gray-500">{fmt.dateLong(booking.arrivalTime)}</div>
                {(booking.arrivalTerminal || booking.arrivalGate) && (
                  <div className="text-[11px] text-gray-400">
                    {booking.arrivalTerminal && `Terminal ${booking.arrivalTerminal}`}
                    {booking.arrivalGate && ` · Gate ${booking.arrivalGate}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PASSENGERS ── */}
        <div className="px-10 py-6 border-b border-gray-200">
          <div className="text-[9px] uppercase tracking-[0.22em] text-gray-400 mb-4">
            Passenger(s)
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Name", "Type", "Seat", "Class"].map((h) => (
                  <th key={h} className="text-[9px] uppercase tracking-widest text-gray-400 font-normal pb-2.5 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(booking.passengers || []).map((p, i) => {
                const seat = booking.seatInstances?.[i]
                const name = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "—"
                return (
                  <tr key={i}>
                    <td className="py-2.5 font-semibold text-gray-900 text-[13px]">{name}</td>
                    <td className="py-2.5 text-gray-500 text-[12px]">
                      {p.isAdult !== undefined ? (p.isAdult ? "Adult" : "Child") : "Adult"}
                    </td>
                    <td className="py-2.5 font-bold text-gray-900 text-[13px] font-mono">
                      {seat?.seatNumber || "—"}
                    </td>
                    <td className="py-2.5 text-gray-500 text-[12px] capitalize">
                      {seat?.seatType?.toLowerCase() || booking.fareName || "Economy"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── DETAILS GRID: Baggage · Contact · Fare ── */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">

          {/* Baggage */}
          <div className="px-8 py-6">
            <div className="text-[9px] uppercase tracking-[0.22em] text-gray-400 mb-3.5">Baggage</div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Cabin</span>
                <span className="font-semibold text-gray-800">
                  {booking.cabinBaggageAllowance ? `${booking.cabinBaggageAllowance} kg` : "7 kg"}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Check-in</span>
                <span className="font-semibold text-gray-800">
                  {booking.checkinBaggageAllowance ? `${booking.checkinBaggageAllowance} kg` : "15 kg"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-8 py-6">
            <div className="text-[9px] uppercase tracking-[0.22em] text-gray-400 mb-3.5">Contact</div>
            <div className="space-y-2 text-[12px]">
              <div className="text-gray-500 truncate">{booking.contactInfo?.email || "—"}</div>
              <div className="text-gray-500">{booking.contactInfo?.phone || "—"}</div>
            </div>
          </div>

          {/* Fare */}
          <div className="px-8 py-6">
            <div className="text-[9px] uppercase tracking-[0.22em] text-gray-400 mb-3.5">Fare</div>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Base Fare</span>
                <span className="font-semibold text-gray-800">₹{baseFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxes</span>
                <span className="font-semibold text-gray-800">₹{taxes.toLocaleString()}</span>
              </div>
              {fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Fees</span>
                  <span className="font-semibold text-gray-800">₹{fees.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PERFORATION LINE ── */}
        <div className="relative flex items-center my-0">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-gray-100 border border-gray-300" />
          <div className="w-full border-t-2 border-dashed border-gray-300 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-gray-100 border border-gray-300" />
        </div>

        {/* ── BOTTOM STUB ── */}
        <div className="px-10 py-6 flex items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-[13px] font-bold text-gray-800 tracking-tight">
              {booking.departureAirport} → {booking.arrivalAirport}
            </div>
            <div className="text-[12px] text-gray-600">
              {booking.passengers?.[0]?.fullName || "Passenger"}
              {booking.seatInstances?.[0]?.seatNumber && (
                <span className="ml-3 font-mono font-bold text-gray-900">
                  Seat {booking.seatInstances[0].seatNumber}
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400">
              {fmt.dateLong(booking.departureTime)} · {fmt.time(booking.departureTime)}
            </div>
            <div className="text-[11px] font-mono font-bold text-gray-700 mt-1">
              {booking.bookingReference}
            </div>
          </div>

          {/* QR placeholder */}
          <div className="border border-gray-300 p-2 flex-shrink-0">
            <QrCode className="h-[72px] w-[72px] text-gray-800" />
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t border-gray-200 px-10 py-4 text-[10px] text-gray-400 leading-relaxed">
          This is a computer-generated e-ticket and does not require a physical signature.
          Carry valid photo ID at the airport. Arrive 2 hrs before departure.
          Boarding closes 25 min before departure.
          Subject to terms &amp; conditions of {booking.flightName || "the carrier"}.
        </div>
      </div>

    </div>
  )
}

export default Ticket
