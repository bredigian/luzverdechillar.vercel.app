"use client"

import { DateTime } from "luxon"
import { EstimateProps } from "@/types/estimates.types"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

interface Props {
  data: EstimateProps[]
}

const COLORS = ["#023b1f", "#048b47", "#25f88f"]
const TEXT_COLORS = ["#fff", "#fff", "#000"]

export default function Schedule({ data }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      displayEventEnd
      nowIndicator={false}
      initialView="dayGridMonth"
      events={data.map((estimate, index) => ({
        start: DateTime.fromJSDate(new Date(estimate.from)).toJSDate(),
        end: DateTime.fromJSDate(new Date(estimate.to))
          .plus({ days: 1 })
          .toJSDate(),
        title: `${estimate.person.firstName} ${
          estimate.person.lastName
        } ${Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 2,
        }).format(estimate.totalCost)}`,
        allDay: true,
        id: estimate._id,
        color: COLORS[index],
        textColor: TEXT_COLORS[index],
      }))}
      eventContent={EventContent}
      eventClassNames={"mb-1 truncate px-2 py-1"}
      height={"90dvh"}
      locale={{ code: "es-AR" }}
    />
  )
}

function EventContent(eventInfo: {
  timeText: string
  event: { title: string }
}) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
