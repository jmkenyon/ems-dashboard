
export function parseHolidayFile(fileContent: string) {

    const lines = fileContent.split("\n"); // split by new line
    const dataLines = lines.slice(1)
    .filter(line => line.trim().length > 0);

    const parsedData = dataLines.map((line) => {
      const [market, date, code, description, exchange] = line.split(',').map(val => val?.trim());;
      return { market, date, code, description, exchange };
    });
    return parsedData.map(item => ({
      market: item.market,
      date: item.date
    }));
  };
