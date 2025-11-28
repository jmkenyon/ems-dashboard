eze_to_pandas = {
    # --- US Exchanges ---
    "NAS": "NASDAQ",
    "NYS": "NYSE",
    "ARC": "NYSE",                    # NYSE Arca → NYSE equities bucket
    "ASE": "NYSE",                    # NYSE MKT / AMEX
    "BSE": "XBOS",                    # Boston → later NASDAQ BX (not in your list)
    "CSE": "XNYS",                    # Chicago Stock Exchange → NYSE Chicago
    "IEX": "IEX",
    "BZX": "BATS",                    # Cboe BZX
    "BAT": "BATS",
    "MMX": "MEMX",                    # Members Exchange
    "LTX": "UNKNOWN",                 # Long-Term Stock Exchange (not in your list)

    # --- Futures (CME Group, ICE, CBOE, etc.) ---
    "CME": "CMES",
    "CMG": "CMES",                    # Globex
    "CMX": "NYMEX",                   # COMEX maps under CME Group
    "NYM": "NYMEX",
    "CFE": "CFE",                     # CBOE Futures
    "CBT": "CBOT",
    "ECB": "CBOT",                    # eCBOT platform feed
    "NYB": "ICEUS",                   # ICE US
    "ICE": "ICE",
    "END": "ICE",                     # ICE Endex
    "ENO": "ICE",                     # Euronext OTC routed through ICE
    "EUX": "EUREX",                   # Eurex
    "STX": "EUREX",                   # Eurex STOXX indices
    "ETI": "EUREX",                   # DAX indices → Eurex

    # --- Canada ---
    "TOR": "TSX",
    "VAN": "TSXV",
    "VAI": "TSXV",
    "NEO": "UNKNOWN",                 # NEO Exchange not in your list
    "LYX": "UNKNOWN",

    # --- Latin America ---
    "MEX": "XMEX",
    "MDX": "UNKNOWN",                 # MexDer not in your list
    "BMF": "BMF",                     # Brazil futures
    "BOV": "BVMF",
    "BAS": "UNKNOWN",                 # Buenos Aires not in your list
    "COL": "XBOG",
    "LIM": "XLIM",
    "SSE": "XSGO",

    # --- Middle East ---
    "DFM": "UNKNOWN",                 # Dubai Financial Market
    "DGC": "UNKNOWN",                 # Dubai Gold & Commodities Exchange
    "TAV": "XTAE",                    # Tel Aviv Stock Exchange
    "SAU": "XSAU",                    # Saudi Exchange (Tadawul)

    # --- Europe (Euronext + others) ---
    "AMS": "XAMS",
    "PAR": "XPAR",
    "BRU": "XBRU",
    "LIS": "XLIS",
    "DUB": "XDUB",
    "OSL": "XOSL",
    "HEL": "XHEL",
    "STO": "XSTO",
    "VIE": "XWBO",
    "ZAG": "XZAG",
    "FRA": "XFRA",
    "ETR": "XETR",
    "DUS": "XDUS",
    "HAM": "XHAM",
    "HAN": "UNKNOWN",
    "CPH": "XCSE",
    "PRG": "XPRA",
    "WAR": "XWAR",
    "MAD": "XMAD",
    "MIL": "XMIL",
    "LSE": "XLON",
    "LUX": "XLUX",
    "OSD": "XOSL",    # Oslo derivatives
    "STU": "UNKNOWN", # Stuttgart not in your pandas list
    "SWX": "XSWX",
    "SWI": "XSWX",    # Swiss indices
    "TRQ": "UNKNOWN", # Turquoise

    # --- Africa ---
    "JNB": "XJSE",
    "SAF": "UNKNOWN", # SAFEX futures
    "BOT": "UNKNOWN",
    "NAM": "UNKNOWN",
    "NAX": "UNKNOWN",

    # --- Asia-Pacific ---
    "AUS": "XASX",
    "ASX": "XASX",
    "HKS": "XHKG",
    "HKF": "UNKNOWN",
    "TCE": "UNKNOWN", # Tokyo Commodity Exchange
    "TYS": "XTKS",
    "TYI": "XTKS",
    "TYB": "XTKS",
    "TAI": "XTAI",
    "TWF": "UNKNOWN", # Taiwan Futures not in list
    "NIK": "UNKNOWN", # Nikkei Indices
    "JAS": "JASDAQ",  # maps to JPX, so XJPX
    "JAK": "XIDX",
    "MYI": "UNKNOWN",
    "MYS": "XKLS",
    "NZS": "XNZE",
    "SFE": "UNKNOWN", # Sydney Futures Exchange
    "SES": "XSES",
    "SET": "XBKK",
    "SHH": "XSHG",
    "SHZ": "XSHE",
    "SHF": "UNKNOWN", # Shanghai futures exchange
    "HSX": "UNKNOWN", # Ho Chi Minh = HOSE (not in your list)
    "HNX": "UNKNOWN", # Hanoi Stock Exchange

    # --- Crypto ---
    "CBA": "UNKNOWN",     # Coinbase Exchange (not in Pandas list)
    "CBS": "UNKNOWN",     # Coinbase Prime
    "FLX": "UNKNOWN",     # FalconX

    # --- Indices (no Pandas mapping normally) ---
    "DJI": "DJIA",
    "SPI": "UNKNOWN",
    "RUS": "UNKNOWN",
    "MOR": "UNKNOWN",

    # --- If no match was found ---
}