import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarPage({ tasks }) {

  const events = tasks.map(task => ({
    title: task.title,
    date: task.due_date
  }));

  return (
    <div className="animate-fade-in">

      <h1 className="text-3xl font-bold mb-6">
        Calendar
      </h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
        />

      </div>

    </div>
  );
}

export default CalendarPage;