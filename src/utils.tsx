import { Button } from "@mobiscroll/react";

export const resourceHeader = (resource: any) => {
  return (
    <div className="resource-template-content">
      <img className="resource-avatar" src={resource.img} alt="avatar img" />
      <div className="resource-name">{resource.name}</div>
    </div>
  );
};

const getCategory = (id: any) => {
  switch (id) {
    case 1:
      return {
        name: "Sustitución",
        background: "#ffcfb8",
        border: '#ff6d24',
        fontColor: '#ff5500'
      };
    case 2:
      return {
        name: "Reparación",
        background: "#f3c4ff",
        border: '#bd75d0',
        fontColor: '#7d009e'
      };
    case 3:
      return {
        name: "Plexi",
        background: "#f3f7e1",
        border: '#86a602',
        fontColor: '#4f5e0e'
      };
    case 4:
      return {
        name: "Vaps",
        background: "#fad9e8",
        border: '#db126a',
        fontColor: '#8a043e'
      };
    case 5:
      return {
        name: "Descendente",
        background: "#daf5f7",
        border: '#00c5d9',
        fontColor: '#006d78'
      };
    default:
      return {
        name: "No category",
        background: "#ebebeb",
        border: '#858585',
        fontColor: '#363636'
      };
  }
};

export const renderScheduleEvent = (data: any) => {
  const cat = getCategory(data.original.category);
  return (
    <div
      className="md-custom-event-cont"
      style={{ borderLeft: "5px solid " + cat.border, background: cat.background, padding: '8px', height: '100%', overflow: 'hidden' }}
    >
      <div className="md-custom-event-wrapper">
        <div
          style={{ color: cat.fontColor }}
          className="md-custom-event-category"
        >
          {cat.name}
        </div>
        <div className="md-custom-event-details" style={{ color: cat.fontColor }}>
          <div className="md-custom-event-title">{data.title}</div>
          <div className="md-custom-event-time">
            {data.start} - {data.end}
          </div>
          <div className="mbsc-button-group mbsc-row">
            <Button icon="tag"  style={{ color: cat.fontColor }}></Button>
            <Button icon="heart" style={{ color: cat.fontColor }}></Button>
            <Button icon="flag" disabled style={{ color: cat.fontColor }}></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export const today = new Date();

export const defaultColors = [
  {
    background: "#ededed",
    start: "09:00",
    end: "19:00",
    resource: [1], // Define este color de fondo al posicionar un evento sobre la columna del recurso ID 4. En este caso Columna No Presentado
    recurring: {
      repeat: "daily",
    },
  },
  {
    background: "#ededed",
    start: "09:00",
    end: "19:00",
    resource: [4], // Define este color de fondo al posicionar un evento sobre la columna del recurso ID 4. En este caso Columna No Presentado
    recurring: {
      repeat: "daily",
    },
  },
];

/* Supported values: 1, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 480, 720, 1440. In minutes */
export const timeValues = [5, 10, 15, 20, 30, 60, 120] 

