import React, {useEffect, useState } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import './App.css'
import { Chart } from './Chart';
import { Map } from './Map';
import { Table } from "./Table";

const SevenDayPerMillion = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a, pop) => (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6}
    />
  );
};

const FourteenDayPer1e5 = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a, pop) => (a.reduce((a, b) => a + b, 0) / pop) * 1e5}
    />
  );
};

const WeeklyChange = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a) => {
        let prev = a.slice(0, 7).reduce((a, b) => a + b, 0);
        let curr = a.slice(-7).reduce((a, b) => a + b, 0);
        return (100 * (curr - prev)) / prev;
      }}
    />
  );
};

const Deaths = ({ deaths }) => {
  let filtered = Object.entries(deaths).filter(([, count]) => count > 88);
  filtered.sort(([, count1], [, count2]) => count2 - count1);
  return (
    <ol>
      <li>total: {Object.values(deaths).reduce((a, b) => a + b, 0)}</li>
      {filtered.map(([day, count]) => (
        <li>
          {day}: {count}
        </li>
      ))}
    </ol>
  );
};

function App() {
  const [cases, setCases] = useState({ Totalt_antal_fall: {} });
  const [deaths, setDeaths] = useState({});
  const [region, setRegion] = useState("0");

  useEffect(() => {
    fetch("http://linode.hersen.name:3000/cases").then(
      (faunaResp) => {
        if (!faunaResp.ok) {
          return faunaResp.text().then((error) => {});
        }

        return faunaResp.json().then(
          (json) => {
            setCases(json);
          },
          (error) => {
            console.log("error", error);
          }
        );
      }
    );

    fetch("http://linode.hersen.name:3000/deaths").then(
      (faunaResp) => {
        if (!faunaResp.ok) {
          return faunaResp.text().then((error) => {});
        }

        return faunaResp.json().then(
          (json) => {
            setDeaths(json);
          },
          (error) => {
            console.log("error", error);
          }
        );
      }
    );
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/7">7-day rolling average per million people</Link>
          </li>
          <li>
            <Link to="/14">14-day case notification rate per 100000</Link>
          </li>
          <li>
            <Link to="/change">
              7-day average change compared to previous 7-day period
            </Link>
          </li>
          <li>
            <Link to="/deaths">deaths</Link>
          </li>
          <li>
            <Link to="/map">map</Link>
          </li>
          <li>
            <Link to="/chart">chart of 7-day average</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/7">
          <SevenDayPerMillion cases={cases} />
        </Route>
        <Route path="/14">
          <FourteenDayPer1e5 cases={cases} />
        </Route>
        <Route path="/change">
          <WeeklyChange cases={cases} />
        </Route>
        <Route path="/deaths">
          <Deaths deaths={deaths} />
        </Route>
        <Route path="/map">
          <Map cases={cases} />
        </Route>
        <Route path="/chart">
          <input
            type="number"
            value={region}
            name="region"
            onChange={(event) => {
              setRegion(event.target.value);
            }}
          />
          <Chart cases={cases} region={region} />
        </Route>
        <Route path="/">home</Route>
      </Switch>
    </Router>
  );
}

export default App
