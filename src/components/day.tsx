// import React from 'react';

const Day = () => {
  const today = new Date();

  // Get the formatted date and day
  const dayOfWeek = today.toLocaleDateString("de-DE", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate the week number
  const getWeekOfYear = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      Number(date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };
  const weekOfYear = getWeekOfYear(today);

  return (
    <>
      <div className="flex items-center p-4 mt-4">
        <div className="text-left w-1/2 ">
          <div className="text-lg font-semibold text-gray-700">Heute</div>
          <div className="text-md text-gray-500">{formattedDate}</div>
        </div>
        <div className="text-right w-1/2">
          <div className="text-sm text-gray-500">Woche {weekOfYear} </div>
          <div className="text-3xl font-bold text-blue-600">{dayOfWeek}</div>
        </div>
      </div>
    </>
  );
};

export default Day;
