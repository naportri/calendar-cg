export const invalidHours = [
  {
    start: "13:00",
    end: "14:00",
    title: "Lunch break",
    recurring: {
      repeat: "weekly",
      weekDays: "MO,TU,WE,TH,FR",
    },
    cssClass: "md-lunch-break-class mbsc-flex",
  },
];

export const today = new Date()