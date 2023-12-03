import { DateTime } from "luxon";
import { Place } from "./api/places";

export class Min {
  static getMinutes(x: number) {
    return x % 60;
  }

  static getHours(x: number) {
    return Math.floor(x / 60) % 24;
  }

  static getDay(x: number) {
    return Math.floor(x / 60 / 24);
  }

  static timeString(x: number) {
    return (
      Min.getHours(x).toString().padStart(2, "0") +
      ":" +
      Min.getMinutes(x).toString().padStart(2, "0")
    );
  }

  static toDate(x: number, ref = new Date()) {
    let min = this.getMinutes(x);
    let hour = this.getHours(x);
    let day = this.getDay(x);

    let d = new Date(ref);
    let cDay = (d.getDay() + 7 - 1) % 7;
    d.setDate(d.getDate() + (day - cDay));
    d.setHours(hour);
    d.setMinutes(min);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
  }

  static fromParams(day: number, hours: number, minutes: number) {
    return day * 24 * 60 + hours * 60 + minutes;
  }

  static fromDate(d: Date) {
    let day = (d.getDay() + 7 - 1) % 7;

    return Min.fromParams(day, d.getHours(), d.getMinutes());
  }

  static fromDateTime(d: DateTime) {
    let day = (d.weekday + 7 - 1) % 7;

    return Min.fromParams(day, d.hour, d.minute);
  }

  static inRange(x: number, range: [number, number]) {
    if (range[1] > range[0]) return range[0] <= x && range[1] >= x;
    else return range[0] <= x || range[1] >= x;
  }

  static since(x: number, from: number) {
    if (x < from) return x + 7 * 24 * 60 - from;
    else return x - from;
  }

  static until(x: number, to: number) {
    if (to < x) return to + 7 * 24 * 60 - x;
    else return to - x;
  }

  static currentRange(x: number, ranges: [number, number][]) {
    return ranges.find((range) => Min.inRange(x, range));
  }

  static nextRange(x: number, ranges: [number, number][]) {
    return ranges.find((range) => range[0] > x) || ranges[0];
  }
}

const osmDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function osm2wme(x: string): [number, number][] {
  if (x === "24/7") return [[0, 7 * 24 * 60 - 1]];

  let rawTimes: [number, number][] = [];

  let ranges = x.split("; ");
  ranges.forEach((r) => {
    let chunks = r.split(", ");
    chunks.forEach((c) => {
      let tok = c.split(" ");
      let days = tok[0];
      let times = tok[1];

      let dayChunks = days.split(",");
      let sanitizedDays: string[] = [];
      dayChunks.forEach((d) => {
        if (d.includes("-")) {
          let rangeSpec = d.split("-");
          if (
            osmDays.includes(rangeSpec[0]) &&
            osmDays.includes(rangeSpec[1])
          ) {
            for (
              let i = osmDays.indexOf(rangeSpec[0]);
              osmDays[i % osmDays.length] !== rangeSpec[1];
              i++
            ) {
              sanitizedDays.push(osmDays[i % osmDays.length]);
            }
            sanitizedDays.push(rangeSpec[1]);
          }
        } else {
          if (osmDays.includes(d)) sanitizedDays.push(d);
        }
      });

      let timeChunks = times.split(",");
      let sanitizedTimes: [number, number][] = [];
      timeChunks.forEach((t) => {
        if (t === "off") return;
        let x = t.split("-").map((x) => {
          let tt = x.split(":").map((x) => parseInt(x, 10));
          return tt[0] * 60 + tt[1];
        });
        if (x[1] < x[0]) x[1] += 24 * 60;
        sanitizedTimes.push([x[0], x[1] - 1]); // end is exclusive in OSM, inclusive in WM. since WM is not infinite-resolution, we can get away with this
      });

      rawTimes.push(
        ...(sanitizedDays.flatMap((d) => {
          let dt = osmDays.indexOf(d) * 24 * 60;
          return sanitizedTimes.map((t) =>
            t.map((x) => (x + dt) % (7 * 24 * 60))
          );
        }) as [number, number][])
      );
    });
  });

  let prioritizedTimes: [number, number][] = [];
  rawTimes.forEach((x) => {
    prioritizedTimes = [
      ...prioritizedTimes.filter((y) => {
        if (x[1] <= x[0] && y[1] <= y[0]) return false;
        else if (x[1] <= x[0] && y[1] > y[0])
          return y[1] <= x[0] && y[0] >= x[1];
        else if (x[1] <= x[0] || y[1] <= y[0]) return y[0] >= x[1];
        else if (x[1] >= y[0]) return x[0] >= y[1];
        else return true;
      }),
      x,
    ];
  });

  prioritizedTimes.sort((a, b) => a[0] - b[0]);

  let mergedTimes: [number, number][] = [];

  prioritizedTimes.forEach((x) => {
    let i = mergedTimes.findIndex((y) => y[1] === x[0]);
    if (i !== -1) {
      x[0] = mergedTimes[i][0];
      mergedTimes.splice(i, 1);
    }
    mergedTimes.push(x);
  });

  return mergedTimes;
}

export function wme2osm(x: [number, number][]) {
  if (x.length === 1 && x[0][0] === 0 && x[0][1] === 0) return "24/7";

  const __dayGroup = new Array(7).fill(0).map((_, i) => {
    return x.filter((x) => Min.getDay(x[0]) === i);
  });

  const _dayGroup = __dayGroup.map((x, i) => {
    return [
      osmDays[i],
      x
        .map((x) => {
          return x
            .map((x, ii) => {
              let o = x - i * 24 * 60;
              if (o < 0) o += 7 * 24 * 60;
              if (ii === 1) o += 1;

              return (
                Math.floor(o / 60)
                  .toString()
                  .padStart(2, "0") +
                ":" +
                (o % 60).toString().padStart(2, "0")
              );
            })
            .join("-");
        })
        .join(","),
    ];
  });

  const dayGroup = Object.entries(
    _dayGroup.reduce((a, x) => {
      if (x[1].trim().length === 0) return a;
      if (!a[x[1]]) a[x[1]] = [];
      a[x[1]].push(x[0]);
      return a;
    }, {} as Record<string, string[]>)
  )
    .map((x) => x[1].join(",") + " " + x[0])
    .join("; ");

  return dayGroup;
}

export function getOpeningSnippets(
  place: Place,
  date: Date,
  log = false,
  strict = false
) {
  let weekday = (date.getDay() + 7 - 1) % 7;

  let opening = osm2wme(place.opening ?? "");
  let wmeStart = Min.fromDate(date);
  let wmeEnd = ((weekday + 1) * 24 * 60 - 1) % (7 * 24 * 60);
  let wmeToday = [wmeStart, wmeEnd];

  let relevantOpenings = opening
    .filter((y) => {
      let modY = y[1] < y[0] ? [y[0], y[1] + 7 * 24 * 60] : y;
      let modW =
        wmeToday[1] < y[0]
          ? wmeToday[1] < wmeToday[0]
            ? [wmeToday[0], wmeToday[1] + 7 * 24 * 60]
            : wmeToday.map((x) => x + 7 * 24 * 60)
          : wmeToday;
      return (
        modW[0] <= modY[1] &&
        modW[1] >= modY[0] &&
        (!strict || y[0] >= wmeToday[0])
      );
    })
    .map((y) => [y[0], y[1]]);
  let relevantSnippets = relevantOpenings.map((x) => [
    wmeEnd < x[0] && x[1] < x[0] ? wmeStart : Math.max(x[0], wmeStart),
    strict
      ? wmeStart > x[1] && x[1] < x[0]
        ? wmeEnd
        : Math.min(wmeEnd, x[1])
      : x[1],
  ]);
  if (log) console.log(relevantSnippets);

  return relevantSnippets;
}

export function getPossiblePicks(
  place: Place,
  date: Date,
  log = false,
  strict = false,
  withDeadline = false
): [number, number[]][] {
  const _possiblePicks = getOpeningSnippets(place, date, log, strict)
    .flatMap(([start, _end]) => {
      const end =
        ((withDeadline ? _end - place.deadline : _end) + 10080) % 10080;

      let startHour = Min.getHours(start);
      let endHour = Min.getHours(end);

      let startMinutes = Min.getMinutes(start);
      let endMinutes = Min.getMinutes(end);

      let o = [];
      for (
        let i = startHour;
        i <= (endHour < startHour ? endHour + 24 : endHour);
        i++
      ) {
        let minutes = new Array(60)
          .fill(0)
          .map((_, i) => i)
          .filter((x) => x % place.granularity === 0);

        if (i === startHour) {
          minutes = minutes.filter((x) => x >= startMinutes);
        }

        if (i === endHour) {
          minutes = minutes.filter((x) => x <= endMinutes);
        }

        if (minutes.length === 0) continue;

        o.push([i, minutes]);
      }
      return o;
    })
    .reduce((a, x) => {
      if (a[x[0].toString()]) {
        a[x[0].toString()] = a[x[0].toString()]
          .concat(x[1])
          .sort((a, b) => a - b);
      } else {
        a[x[0].toString()] = x[1] as number[];
      }

      return a;
    }, {} as Record<string, number[]>);

  const possiblePicks = Object.entries(_possiblePicks)
    .map(([k, v]) => [parseInt(k), v])
    .sort((a, b) => (a[0] as number) - (b[0] as number));

  if (log) console.log(possiblePicks);
  return possiblePicks as [number, number[]][];
}
