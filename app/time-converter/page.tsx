"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import PageSkeleton from "../components/PageSkeleton";
import FormButton from "../components/FormButton";

const TimeConverterPage = () => {
  const [server, setServer] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [showResults, setShowResults] = useState(false);

  const sourceZone =
    server === "NJ"
      ? "America/New_York"
      : server === "OMS"
      ? "America/Chicago"
      : server === "LD6"
      ? "Europe/Rome"
      : "";
  const targetZones = [
    "Europe/London",
    "Europe/Berlin",
    "America/Chicago",
    "America/New_York",
    "Asia/Hong_Kong",
  ];
  const [ukTime, setUkTime] = useState("");
  const [cetTime, setCetTime] = useState("");

  const [chicagoTime, setChicagoTime] = useState("");
  const [njTime, setNjTime] = useState("");
  const [hkTime, setHkTime] = useState("");
  const regexColon = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const regexNumbers = /^([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/;

  const convertTime = (time: string, fromZone: string, toZone: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);

    const sourceTime = DateTime.fromObject(
      { hour: hours, minute: minutes, second: seconds },
      { zone: fromZone }
    );

    const convertedTime = sourceTime.setZone(toZone);
    return convertedTime.toFormat("HH:mm:ss");
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("HELLLOOO")
    e.preventDefault();
    if (!sourceZone) {
      alert("Please select a valid server.");
      return;
    }

    if (!timestamp) {
      alert("Please enter a timestamp.");
      return;
    }

    if (regexNumbers.test(timestamp)) {
      const formattedTimestamp = timestamp.replace(
        /(\d{2})(\d{2})(\d{2})/,
        "$1:$2:$3"
      );
      setTimestamp(formattedTimestamp);
      if (!regexColon.test(formattedTimestamp)) {
        alert("Please enter a valid timestamp in HH:MM:SS format.");
        return;
      }
      return;
    }

    if (!regexColon.test(timestamp)) {
      alert("Please enter a valid timestamp in HH:MM:SS format.");
      return;
    }
    setShowResults(true);

    const convertedTimes = targetZones.map((zone) =>
      convertTime(timestamp, sourceZone, zone)
    );

    const [ukTime, cetTime, chicagoTime, njTime, hkTime] = convertedTimes;
    setUkTime(ukTime);
    setCetTime(cetTime);

    setChicagoTime(chicagoTime);
    setNjTime(njTime);
    setHkTime(hkTime);
  };

  return (
    <PageSkeleton
      title="Time Stamp Converter"
      subtitle="Convert server timestamps between different time zones."
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="text-sm sm:text-base">
          Choose a server:
          <select
            className="ml-4"
            onChange={(e) => setServer(e.target.value)}
            value={server}
          >
            <option value="">-- Select --</option>
            <option value="NJ">NJ</option>
            <option value="OMS">OMS</option>
            <option value="LD6">LD6</option>
          </select>
        </label>
        <label className="flex flex-row gap-3 text-sm sm:text-base">
          Enter a timestamp:
          <input
            name="timestamp"
            value={timestamp}
            placeholder="HH:MM:SS"
            className="border border-w rounded border-gray-500 bg-gray-50 px-1"
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </label>
        <FormButton>Convert Time</FormButton>
      </form>
      {showResults && (
        <div className="max-w-1/2">
          <h2 className="text-xl font-bold pt-10 pb-2">Converted Times:</h2>
          <div className="grid grid-cols-2 gap-y-1 mt-6">
            <p className="font-bold">UK:</p>
            <p>{ukTime}</p>

            <p className="font-bold">CET:</p>
            <p>{cetTime}</p>

            <p className="font-bold">Chicago:</p>
            <p>{chicagoTime}</p>

            <p className="font-bold">New Jersey:</p>
            <p>{njTime}</p>

            <p className="font-bold">Hong Kong:</p>
            <p>{hkTime}</p>
          </div>
        </div>
      )}
    </PageSkeleton>
  );
};

export default TimeConverterPage;
