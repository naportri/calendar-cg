import React, { useState, useCallback } from "react";
import { Draggable } from "@mobiscroll/react";

export const Appointment = ({ data }: any) => {
  const [draggable, setDraggable] = useState<any>();

  const setDragElm = useCallback((elm: any) => {
    setDraggable(elm);
  }, []);

  const event = data;
  const eventLength =
    Math.abs(new Date(event.end).getTime() - new Date(event.start).getTime()) /
    (60 * 60 * 1000);

  return (
    <div>
      {!event.hide && (
        <div
          ref={setDragElm}
          className="docs-appointment-task"
          style={{ background: event.color, color: 'black' }}
        >
          <div>{event.title} - {eventLength + " hour" + (eventLength > 1 ? "s" : "")}</div>
          <Draggable dragData={event} element={draggable} />
        </div>
      )}
    </div>
  );
};
