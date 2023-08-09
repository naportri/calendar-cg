/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef, FC, useMemo } from "react";
import dayjs from "dayjs";
import {
  Eventcalendar,
  Dropcontainer,
  setOptions,
  toast,
  MbscEventcalendarView,
  MbscCalendarEvent,
  localeEs,
  formatDate,
  Popup,
  Toast,
  Button,
  Datepicker,
} from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import classNames from "classnames";
import events from "./mockData/events-a.json";
import pendingAppointments from "./mockData/pendingAppointments.json";
import employees from "./mockData/employees.json";
import { Appointment } from "./components/Appointment";
import "./App.css";
import { resourceHeader, renderScheduleEvent, invalidHours, today, defaultColors } from "./utils";

setOptions({
  locale: localeEs,
  theme: "ios",
  themeVariant: "light",
});

const App: FC = () => {
  const [appointments, setAppointments] =
    useState<MbscCalendarEvent[]>(pendingAppointments);
  const [timeZoom, setTimeZoom] = useState<number>(15);

  const view = useMemo<MbscEventcalendarView>(() => {
    return {
      schedule: {
        type: "day",
        size: 1,
        startTime: "08:00",
        endTime: "20:00",
        allDay: false,
        timeCellStep: timeZoom, // tiempo en el que se pone la linea del separado
        timeLabelStep: timeZoom, // tiempo que se pone en la cuadricula lateral
      },
    };
  }, [timeZoom]);

  const secondView = useMemo<MbscEventcalendarView>(() => {
    return {
      schedule: {
        type: "day",
        size: 1,
        startDay: 1,
        endDay: 6,
        allDay: false,
        timeCellStep: 60, // tiempo en el que se pone la linea del separado
        timeLabelStep: 60, // tiempo que se pone en la cuadricula lateral
        currentTimeIndicator: false,
      },
    };
  }, []);

  const [refDate, setRefDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [contBg, setContBg] = useState<string>("");
  const [myColors, setColors] = useState<any>(defaultColors);
  const [dropCont, setDropCont] = useState<any>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [info, setInfo] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonType, setButtonType] = useState<any>("");
  const timerRef = useRef<any>(null);
  const [isToastOpen, setToastOpen] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>();
  const [dobleCalendar, setDobleCalendar] = useState(false);

  const setDropElm = useCallback((elm: any) => {
    setDropCont(elm);
  }, []);

  const hasOverlap = (event: any, inst: any) => {
    const events = inst
      .getEvents(event.start, event.end)
      .filter((e: any) => e.id !== event.id && e.resource === event.resource);
    return events.length > 0;
  };

  const onEventCreate = React.useCallback(
    (args: any) => {
      const event = args.event;
      const inst = args.inst;
      event.unscheduled = false;
      setColors(defaultColors);

      if (hasOverlap(event, inst)) {
        toast({
          message: "Make sure not to double book",
        });
        return false;
      } else if (!(today < event.start)) {
        toast({
          message: "Can't add event in the past",
        });
        return false;
      } else {
        toast({
          message: args.event.title + " added",
        });
        setAppointments(appointments.filter((item) => item.id !== event.id));
      }
    },
    [appointments]
  );

  const openTooltip = useCallback((args: any, closeOption: any) => {
    const event = args.event;
    const time =
      formatDate("hh:mm A", new Date(event.start)) +
      " - " +
      formatDate("hh:mm A", new Date(event.end));

    setCurrentEvent(event);

    if (event.confirmed) {
      setStatus("Confirmed");
      setButtonText("Cancel appointment");
      setButtonType("warning");
    } else {
      setStatus("Canceled");
      setButtonText("Confirm appointment");
      setButtonType("success");
    }

    setInfo(event.title + " ");
    setTime(time);
    setReason(event.job);
    setContBg(event.color);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setAnchor(args.domEvent.currentTarget || args.domEvent.target);
    setOpen(true);
  }, []);

  const onEventHoverIn = useCallback(
    (args: any) => {
      openTooltip(args, false);
    },
    [openTooltip]
  );

  const onEventHoverOut = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const onEventDelete = useCallback((args: any) => {
    if (args.action === "externalDrop" && dobleCalendar) {
      toast({
        message: "Evento reprogramado",
      });
    } else {
      toast({
        message: args.event.title + " unscheduled",
      });
    }
  }, []);

  const onEventDragEnter = useCallback(() => {
    setTimeZoom(5);
  }, []);

  const onEventDragLeave = useCallback(() => {
    setTimeZoom(15);
    setColors(defaultColors);
  }, []);

  /* Funciones del Ascensor */

  const onItemDrop = useCallback(
    (args: any) => {
      if (args.data) {
        args.data.unscheduled = true;
        setAppointments([...appointments, args.data]);
      }
      setContBg("");
    },
    [appointments]
  );

  const onItemDragEnter = useCallback((args: any) => {
    if (!(args.data && args.data.unscheduled)) {
      setContBg("#d0e7d2cc");
    }
  }, []);

  const onItemDragLeave = useCallback(() => {
    setContBg("");
  }, []);

  const onMouseEnter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const setStatusButton = useCallback(() => {
    setOpen(false);
    const index = appointments.findIndex(
      (item: any) => item.id === currentEvent.id
    );
    const newApp = [...appointments];
    newApp[index].confirmed = !appointments[index].confirmed;
    setAppointments(newApp);
    showToast(
      "Appointment " + (currentEvent.confirmed ? "confirmed" : "canceled")
    );
  }, [appointments, currentEvent]);

  const showToast = useCallback((message: string) => {
    setToastText(message);
    setToastOpen(true);
  }, []);

  const deleteApp = useCallback(() => {
    setAppointments(
      appointments.filter((item: any) => item.id !== currentEvent.id)
    );
    setOpen(false);
    showToast("Appointment deleted");
  }, [appointments, currentEvent]);

  const closeToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  const setDobleCalendarView = () => {
    setDobleCalendar(!dobleCalendar);
  };

  const calendarContainer = "mbsc-col-sm";
  const calendarContainerClasses = classNames({
    [`${calendarContainer}-4`]: dobleCalendar,
    [`${calendarContainer}-12`]: !dobleCalendar,
  });

  const onChangeDate = useCallback((event: any) => {
    setSelectedDate(event.value);
    setRefDate(dayjs(event.value).add(1, "days").format("YYYY-MM-DD"));
  }, []);

  return (
    <div className="mbsc-grid main-container">
      <div className="mbsc-row mbsc-justify-content-center">
        <div className="mbsc-col-sm-12 mbsc-justify-content-center">
          <Button
            color="primary"
            variant="outline"
            onClick={setDobleCalendarView}
          >
            Vista Doble
          </Button>
        </div>
      </div>
      <div className="mbsc-row mbsc-justify-content-center">
        <div className="mbsc-col-sm-2" style={{ padding: "1px" }}>
          <div style={{ height: "300px" }}>
            <Datepicker
              controls={["calendar"]}
              display="inline"
              touchUi={true}
              onChange={onChangeDate}
              value={selectedDate}
            />
          </div>
        </div>
        <div className="mbsc-col-sm-10">
          <div className="mbsc-row mbsc-justify-content-center">
            <div
              className={`${calendarContainerClasses} docs-appointment-calendar`}
            >
              <Eventcalendar
                data={events}
                view={view}
                selectedDate={selectedDate}
                resources={employees}
                clickToCreate={true}
                dragToMove={true}
                dragToCreate={true}
                externalDrop={true}
                externalDrag={true}
                colors={myColors} // Define colores de la columna, pueden declararse rangos horarios, o diferentes colores de fondo a diferentes recursos. Ej: Columna No Show podria ser diferente?
                onEventCreate={onEventCreate}
                onEventDelete={onEventDelete}
                onEventDragEnter={onEventDragEnter}
                onEventDragLeave={onEventDragLeave}
                showEventTooltip={false}
                onEventHoverIn={onEventHoverIn}
                onEventHoverOut={onEventHoverOut}
                dragBetweenResources={true} // propiedad para mover entre recursos
                dragToResize={true} // propiedad para ampliar el job
                invalid={invalidHours} // invalidar horario (ej. comida)
                renderResource={resourceHeader} // customizar cabecera con html
                renderScheduleEvent={renderScheduleEvent}
              />
            </div>
            {dobleCalendar && (
              <div className={`mbsc-col-sm-8 docs-appointment-calendar`}>
                <Eventcalendar
                  data={events}
                  view={secondView}
                  selectedDate={refDate}
                  resources={employees}
                  clickToCreate={true}
                  dragToMove={true}
                  dragToCreate={true}
                  externalDrop={true}
                  externalDrag={true}
                  colors={myColors}
                  onEventCreate={onEventCreate}
                  onEventDelete={onEventDelete}
                  onEventDragEnter={onEventDragEnter}
                  onEventDragLeave={onEventDragLeave}
                  showEventTooltip={true}
                  onEventHoverIn={onEventHoverIn}
                  onEventHoverOut={onEventHoverOut}
                  dragBetweenResources={true} // propiedad para mover entre recursos
                  dragToResize={true} // propiedad para ampliar el job
                  invalid={invalidHours} // invalidar horario (ej. comida)
                  renderResource={resourceHeader} // customizar cabecera con html
                  renderScheduleEvent={renderScheduleEvent}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mbsc-row mbsc-justify-content-center">
        <div className="mbsc-col-sm-12 docs-appointment-cont" ref={setDropElm}>
          <Dropcontainer
            onItemDrop={onItemDrop}
            onItemDragEnter={onItemDragEnter}
            onItemDragLeave={onItemDragLeave}
            element={dropCont}
          >
            <div className="mbsc-form-group-title">
              Jobs pendientes de programar
            </div>
            {appointments.map((app) => (
              <Appointment key={app.id} data={app} />
            ))}
          </Dropcontainer>
        </div>
      </div>

      <Popup
        display="anchored"
        isOpen={isOpen}
        anchor={anchor}
        touchUi={false}
        showOverlay={false}
        contentPadding={false}
        closeOnOverlayClick={false}
        width={350}
        cssClass="md-tooltip"
      >
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div
            className="md-tooltip-header"
            style={{ backgroundColor: contBg }}
          >
            <span className="md-tooltip-name-age">{info}</span>
            <span className="md-tooltip-time">{time}</span>
          </div>
          <div className="md-tooltip-info">
            <div className="md-tooltip-title">
              Status:{" "}
              <span className="md-tooltip-status md-tooltip-text">
                {status}
              </span>
              <Button
                color={buttonType}
                variant="outline"
                className="md-tooltip-status-button"
                onClick={setStatusButton}
              >
                {buttonText}
              </Button>
            </div>
            <div className="md-tooltip-title">
              Info del Job:{" "}
              <span className="md-tooltip-reason md-tooltip-text">
                {reason}
              </span>
            </div>
            <div className="md-tooltip-title">
              Location:{" "}
              <span className="md-tooltip-location md-tooltip-text">
                Datos del taller
              </span>
            </div>
            <div className="mbsc-button-group mbsc-row mbsc-justify-content-between">
              <Button icon="tag" color="danger"></Button>
              <Button icon="heart"></Button>
              <Button icon="flag" disabled></Button>
              <Button
                color="danger"
                variant="outline"
                className="md-tooltip-delete-button"
                onClick={deleteApp}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Popup>
      <Toast message={toastText} isOpen={isToastOpen} onClose={closeToast} />
    </div>
  );
};

export default App;
