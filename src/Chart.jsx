import React from "react";

let population = [
  10230000,
  159748,
  287795,
  59636,
  287333,
  333202,
  130697,
  363351,
  245415,
  201290,
  250230,
  1376659,
  2374550,
  297169,
  383044,
  282342,
  271621,
  245380,
  275634,
  1724529,
  304634,
  465214,
];

export const Chart = ({ cases, region }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);
  let columns = headers.map((header) =>
    dates.map((date) => cases[header][date])
  );
  let yMax = 1400;
  let yScale = 600 / yMax;
  let yValues = Array.from({ length: yMax / 100 - 1 }).map(
    (value, i) => (i + 1) * 100
  );

  let sevenDayPerMillion = (a, pop) =>
    (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6;

  return (
    <>
      <div>{headers[region]}</div>
      <div className="chart">
        <div className="y-values">
          {yValues.map((y) => (
            <div className="y-value">{y}</div>
          ))}
        </div>
        <svg viewBox="0 0 800 600">
          {yValues.map((y) => (
            <line x1="0" y1={y * yScale} x2="800" y2={y * yScale} />
          ))}

          <polyline
            fill="none"
            stroke="#c3227d"
            points={(columns[region] || [])
              .map((cell, rowIndex) => {
                let a = columns[region].slice(rowIndex - 13, rowIndex + 1);

                let x = sevenDayPerMillion(a, population[region]) || 0;
                return (
                  (rowIndex * 800) / columns[region].length +
                  "," +
                  (600 - x * yScale)
                );
              })
              .join(" ")}
          />
        </svg>
      </div>
    </>
  );
};
