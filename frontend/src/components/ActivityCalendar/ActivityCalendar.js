import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { ActivityStatus, ActivityStatusLabel } from "../../models/Activity";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ActivityCalendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

function combineDateTime(date, time) {
    if (!date) return new Date();
    if (!time) return new Date(date);
    try {
        return new Date(`${date}T${time}`);
    } catch { return new Date(date); }
}

function statusColor(status) {
    switch (Number(status)) {
        case ActivityStatus.Planned: return "#6c757d";
        case ActivityStatus.Booked: return "#0dcaf0";
        case ActivityStatus.Completed: return "#198754";
        case ActivityStatus.Cancelled: return "#dc3545";
        default: return "#6c757d";
    }
}

function ActivityCalendar({ activities, onSelectActivity, defaultDate = null }) {
    const events = activities.map(a => {
        const start = combineDateTime(a.date, a.time);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
            id: a.id,
            title: `${a.name} (${ActivityStatusLabel[a.status] || ""})`,
            start,
            end,
            resource: a
        };
    });

    function eventStyleGetter(event) {
        return {
            style: {
                backgroundColor: statusColor(event.resource?.status),
                borderRadius: "4px",
                border: "none",
                color: "white",
                padding: "2px 4px",
                fontSize: "0.85rem"
            }
        };
    }

    return (
        <div className="activity-calendar">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                defaultDate={defaultDate || (events.length > 0 ? events[0].start : new Date())}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => onSelectActivity && onSelectActivity(event.resource)}
                views={["month", "week", "day", "agenda"]}
                messages={{
                    next: "Sljedeće",
                    previous: "Prethodno",
                    today: "Danas",
                    month: "Mjesec",
                    week: "Sedmica",
                    day: "Dan",
                    agenda: "Lista",
                    date: "Datum",
                    time: "Vrijeme",
                    event: "Aktivnost",
                    noEventsInRange: "Nema aktivnosti u izabranom periodu."
                }}
            />
        </div>
    );
}

export default ActivityCalendar;