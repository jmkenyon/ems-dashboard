from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas_market_calendars as mcal
import pandas as pd

from exchange_mappings import eze_to_pandas

from pydantic import BaseModel

app = FastAPI()

# Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def check_holiday(market, date):

    """
    Check if a given date is a holiday for the specified market.

    Parameters:
    market (str): The market code (e.g., 'NYSE', 'LSE').
    date (str or pd.Timestamp): The date to check.

    Returns:
    bool: True if the date is a holiday, False otherwise.
    """
    market = eze_to_pandas.get(market, market)
    date = pd.to_datetime(date, format="%m/%d/%Y").normalize()
    print(market, date)

    try: 
        calendar = mcal.get_calendar(market)
    
        date = pd.Timestamp(date)
        return date in calendar.holidays().holidays
    except Exception as e:
        raise ValueError(f"Market '{market}' is not recognized.")


class SingleHoliday(BaseModel):
    market: str
    date: str

class HolidayBatchRequest(BaseModel):
    rows: list[SingleHoliday]

@app.post("/check-holiday")
def api_check_holiday(req: HolidayBatchRequest):
    results = []

   
    for r in req.rows:
        try:
            is_holiday = check_holiday(r.market, r.date)
            results.append({
                "market": r.market,
                "date": r.date,
                "is_holiday": is_holiday,
                "error": None
            })
        except Exception as e:
            results.append({
                "market": r.market,
                "date": r.date,
                "is_holiday": None,
                "error": str(e)
            })

    return results

