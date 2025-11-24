"use client";

import { useState } from "react";
import { DateTime } from "luxon";

const TimeConverter = () => {
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
  const [njTime, setNjTime] = useState("");
  const [chicagoTime, setChicagoTime] = useState("");
  const [hkTime, setHkTime] = useState("");
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

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
    e.preventDefault();
    if (!sourceZone) {
      alert("Please select a valid server.");
      return;
    }

    if (!timestamp) {
      alert("Please enter a timestamp.");
      return;
    }

    if (!regex.test(timestamp)) {
      alert("Please enter a valid timestamp in HH:MM:SS format.");
      return;
    }
    setShowResults(true);

    const convertedTimes = targetZones.map((zone) =>
      convertTime(timestamp, sourceZone, zone)
    );

    const [ukTime, cetTime, njTime, chicagoTime, hkTime] = convertedTimes;
    setUkTime(ukTime);
    setCetTime(cetTime);
    setNjTime(njTime);
    setChicagoTime(chicagoTime);
    setHkTime(hkTime);
  };

  return (
    <div className=" flex flex-col justify-center items-center py-20">
      <div className="bg-white  text-blue-950 sm:p-20 p-10 flex flex-col rounded-2xl shadow-2xl">
        <h1 className="sm:text-3xl text-lg font-bold mb-6">Time Stamp Converter</h1>
        <p className="text-gray-500 pb-10 sm:text-md text-sm">
          Enter the prefix of the server and the timestamp you are looking to
          convert
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="text-sm sm:text-md">
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
          <label className="flex flex-row gap-3 text-sm sm:text-md">
            Enter a timestamp:
            <input
              name="timestamp"
              value={timestamp}
              placeholder="HH:MM:SS"
              className="border border-w rounded border-gray-500 bg-gray-50 px-1"
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-4 rounded mt-10 hover:bg-blue-700 cursor-pointer"
          >
            Convert time
          </button>
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
      </div>
    </div>
  );
};

export default TimeConverter;
