import subprocess
import asyncio
from playwright.async_api import async_playwright
import threading

def start_playwright_warmup():
    async def warmup_playwright():
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
                await browser.close()
            print("Playwright browser pre-warmed at startup.")
        except Exception as e:
            print("Playwright warmup failed:", e)
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            threading.Thread(target=lambda: asyncio.run(warmup_playwright())).start()
        else:
            loop.run_until_complete(warmup_playwright())
    except Exception as e:
        print("Playwright warmup outer exception:", e)

start_playwright_warmup()

try:
    subprocess.run(["playwright", "install", "chromium"], check=True)
except Exception as e:
    print("Failed to install Playwright browsers at runtime:", e)

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
from typing import List, Dict
import traceback
from webscrape2_0 import setup_driver, scrape_amazon_top_10_playwright_async
from profit import parse_price
from rapidfuzz import fuzz
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import re
import uuid
import time

app = FastAPI(title="Amazon Profit Calculator")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants for profit calculation
AMAZON_FEE_PERCENTAGE = 15  # 15% selling fee
SHIPPING_BUFFER = 3  # $3 shipping buffer
SIMILARITY_THRESHOLD = 45  # Fuzzy matching threshold (0-100)

REQUIRED_COLUMNS = ['Description', 'Starting wholesale Price']

# Global progress tracker
global_progress = {}

# Global results tracker
global_results = {}

# Helper to normalize column names
def normalize_col(col):
    return ''.join(str(col).strip().lower().split())

def find_header_row(df, required_columns):
    for i in range(min(10, len(df))):
        row = df.iloc[i]
        norm_row = [normalize_col(x) for x in row]
        if all(normalize_col(req) in norm_row for req in required_columns):
            return i
    return None

@app.get("/health")
def health():
    return {"status": "ok"}

def extract_numeric_price(price_str: str) -> float:
    if not isinstance(price_str, str) or not price_str.strip():
        return None
    cleaned = re.sub(r"[^\d.]", "", price_str)
    try:
        return float(cleaned)
    except ValueError:
        return None

def filter_and_average_matches(description, asins, titles, prices, threshold):
    matched = []
    for asin, title, price in zip(asins, titles, prices):
        if not asin or not title or not price:
            continue
        score = fuzz.token_set_ratio(str(description).lower(), str(title).lower())
        if score >= threshold:
            numeric_price = extract_numeric_price(price)
            matched.append({
                "asin": asin,
                "title": title,
                "price": price,
                "numeric_price": numeric_price,
                "score": score
            })
    avg_price = None
    if matched:
        valid_prices = [m["numeric_price"] for m in matched if m["numeric_price"] is not None]
        if valid_prices:
            avg_price = sum(valid_prices) / len(valid_prices)
    best_match = max(matched, key=lambda x: x["score"]) if matched else None
    return best_match, avg_price

async def process_file(file_content: bytes, upload_id: str = None) -> Dict:
    print("==== process_file CALLED ====")
    print(f"Received file_content of length: {len(file_content)}")
    try:
        # Try reading as Excel, fallback to CSV
        try:
            print("Trying to read as Excel...")
            preview = pd.read_excel(io.BytesIO(file_content), header=None, nrows=10)
            print("Excel preview read successful.")
            header_row = find_header_row(preview, REQUIRED_COLUMNS)
            if header_row is not None:
                print(f"Detected header row at index {header_row}")
                df = pd.read_excel(io.BytesIO(file_content), header=header_row)
            else:
                raise HTTPException(status_code=400, detail="Could not find required columns in the first 10 rows of the Excel file.")
            print("Excel read successful. Columns:", df.columns)
        except Exception as ex1:
            print("Excel read failed:", ex1)
            print("Trying to read as CSV...")
            try:
                preview = pd.read_csv(io.BytesIO(file_content), header=None, nrows=10)
                print("CSV preview read successful.")
                header_row = find_header_row(preview, REQUIRED_COLUMNS)
                if header_row is not None:
                    print(f"Detected header row at index {header_row}")
                    df = pd.read_csv(io.BytesIO(file_content), header=header_row)
                else:
                    raise HTTPException(status_code=400, detail="Could not find required columns in the first 10 rows of the CSV file.")
                print("CSV read successful. Columns:", df.columns)
            except Exception as ex2:
                print("CSV read failed:", ex2)
                raise HTTPException(status_code=400, detail=f"Could not read file as Excel or CSV: {ex1} | {ex2}")

        # Progress tracking setup
        total_rows = len(df)
        if upload_id:
            global_progress[upload_id] = {
                'rows_processed': 0,
                'total_rows': total_rows,
                'start_time': time.time(),
                'last_update_time': time.time(),
                'eta_seconds': None,
                'done': False
            }

        # Robust column matching
        file_col_map = {normalize_col(col): col for col in df.columns}
        print("Normalized columns:", file_col_map)
        matched_cols = {}
        for req in REQUIRED_COLUMNS:
            norm_req = normalize_col(req)
            if norm_req in file_col_map:
                matched_cols[req] = file_col_map[norm_req]
            else:
                print(f"Missing required column: {req}")
                raise HTTPException(status_code=400, detail=f"Missing required column: {req}")

        desc_col = matched_cols['Description']
        price_col = matched_cols['Starting wholesale Price']

        # Use Playwright-based scraping for Amazon
        results = []
        profit_margins = []
        categories = []
        profitable_count = 0
        not_profitable_count = 0
        for idx, row in df.iterrows():
            description = row[desc_col]
            wholesale_price = row[price_col]
            category = row.get('Category', None) if 'Category' in row else None
            try:
                print(f"Scraping Amazon for: {description}")
                asins, titles, prices = await scrape_amazon_top_10_playwright_async(description)
                print(f"Scraping results for '{description}': asins={asins}, titles={titles}, prices={prices}")
                matches = []
                for asin, title, price in zip(asins, titles, prices):
                    if not asin or not title or not price:
                        continue
                    score = fuzz.token_set_ratio(str(description).lower(), str(title).lower())
                    if score >= SIMILARITY_THRESHOLD:
                        numeric_price = extract_numeric_price(price)
                        matches.append({
                            "asin": asin,
                            "title": title,
                            "price": price,
                            "numeric_price": numeric_price,
                            "score": score
                        })
                if not matches:
                    print(f"No matches found for: {description}")
                    results.append({
                        "description": description,
                        "amazon_title": None,
                        "amazon_price": None,
                        "asin": None,
                        "wholesale_price": wholesale_price,
                        "profit_dollars": None,
                        "profit_percentage": None,
                        "match_score": None,
                        "avg_amazon_price": None,
                        "category": category,
                        "result_status": "No results found"
                    })
                    categories.append(category)
                    not_profitable_count += 1
                    # Update progress
                    if upload_id:
                        global_progress[upload_id]['rows_processed'] = idx + 1
                        global_progress[upload_id]['last_update_time'] = time.time()
                        elapsed = time.time() - global_progress[upload_id]['start_time']
                        avg_time = elapsed / (idx + 1)
                        eta = avg_time * (total_rows - (idx + 1))
                        global_progress[upload_id]['eta_seconds'] = int(eta)
                    continue
                if len(matches) == 1:
                    m = matches[0]
                    try:
                        wholesale_price_val = float(wholesale_price)
                    except:
                        wholesale_price_val = parse_price(str(wholesale_price))
                    amazon_price = m["numeric_price"]
                    if not amazon_price or not wholesale_price_val:
                        raise Exception("Invalid price data")
                    amazon_fee = (amazon_price * AMAZON_FEE_PERCENTAGE) / 100
                    total_costs = wholesale_price_val + amazon_fee + SHIPPING_BUFFER
                    profit = amazon_price - total_costs
                    profit_percentage = (profit / wholesale_price_val) * 100
                    results.append({
                        "description": description,
                        "amazon_title": m["title"],
                        "amazon_price": amazon_price,
                        "asin": m["asin"],
                        "wholesale_price": wholesale_price_val,
                        "profit_dollars": round(profit, 2),
                        "profit_percentage": round(profit_percentage, 2),
                        "match_score": m["score"],
                        "avg_amazon_price": amazon_price,
                        "category": category,
                        "result_status": "Single result"
                    })
                    profit_margins.append(profit_percentage)
                    categories.append(category)
                    if profit_percentage >= 25:
                        profitable_count += 1
                    else:
                        not_profitable_count += 1
                    # Update progress
                    if upload_id:
                        global_progress[upload_id]['rows_processed'] = idx + 1
                        global_progress[upload_id]['last_update_time'] = time.time()
                        elapsed = time.time() - global_progress[upload_id]['start_time']
                        avg_time = elapsed / (idx + 1)
                        eta = avg_time * (total_rows - (idx + 1))
                        global_progress[upload_id]['eta_seconds'] = int(eta)
                    continue
                valid_prices = [m["numeric_price"] for m in matches if m["numeric_price"] is not None]
                avg_price = sum(valid_prices) / len(valid_prices) if valid_prices else None
                best_match = max(matches, key=lambda x: x["score"])
                try:
                    wholesale_price_val = float(wholesale_price)
                except:
                    wholesale_price_val = parse_price(str(wholesale_price))
                amazon_price = extract_numeric_price(best_match["price"])
                if not amazon_price or not wholesale_price_val:
                    raise Exception("Invalid price data")
                amazon_fee = (amazon_price * AMAZON_FEE_PERCENTAGE) / 100
                total_costs = wholesale_price_val + amazon_fee + SHIPPING_BUFFER
                profit = amazon_price - total_costs
                profit_percentage = (profit / wholesale_price_val) * 100
                results.append({
                    "description": description,
                    "amazon_title": best_match["title"],
                    "amazon_price": amazon_price,
                    "asin": best_match["asin"],
                    "wholesale_price": wholesale_price_val,
                    "profit_dollars": round(profit, 2),
                    "profit_percentage": round(profit_percentage, 2),
                    "match_score": best_match["score"],
                    "avg_amazon_price": round(avg_price, 2) if avg_price is not None else None,
                    "category": category,
                    "result_status": "Multiple results"
                })
                profit_margins.append(profit_percentage)
                categories.append(category)
                if profit_percentage >= 25:
                    profitable_count += 1
                else:
                    not_profitable_count += 1
                # Update progress
                if upload_id:
                    global_progress[upload_id]['rows_processed'] = idx + 1
                    global_progress[upload_id]['last_update_time'] = time.time()
                    elapsed = time.time() - global_progress[upload_id]['start_time']
                    avg_time = elapsed / (idx + 1)
                    eta = avg_time * (total_rows - (idx + 1))
                    global_progress[upload_id]['eta_seconds'] = int(eta)
            except Exception as e:
                print(f"Exception while processing '{description}': {e}")
                traceback.print_exc()
                # Always append a result, even if there is an error
                results.append({
                    "description": description,
                    "amazon_title": None,
                    "amazon_price": None,
                    "asin": None,
                    "wholesale_price": wholesale_price,
                    "profit_dollars": None,
                    "profit_percentage": None,
                    "match_score": None,
                    "avg_amazon_price": None,
                    "category": category,
                    "result_status": f"Error: {str(e)}"
                })
                categories.append(category)
                not_profitable_count += 1
                # Update progress
                if upload_id:
                    global_progress[upload_id]['rows_processed'] = idx + 1
                    global_progress[upload_id]['last_update_time'] = time.time()
                    elapsed = time.time() - global_progress[upload_id]['start_time']
                    avg_time = elapsed / (idx + 1)
                    eta = avg_time * (total_rows - (idx + 1))
                    global_progress[upload_id]['eta_seconds'] = int(eta)
                continue
        # Mark as done
        if upload_id:
            global_progress[upload_id]['done'] = True
            global_progress[upload_id]['eta_seconds'] = 0
        # Top 5 most profitable products
        top5 = sorted([r for r in results if r["profit_percentage"] is not None], key=lambda x: x["profit_percentage"], reverse=True)[:5]
        # Profit margin histogram (bins)
        bins = [0, 10, 20, 30, 40, 50, 100]
        hist = {f"{bins[i]}-{bins[i+1]}%": 0 for i in range(len(bins)-1)}
        for pm in profit_margins:
            for i in range(len(bins)-1):
                if bins[i] <= pm < bins[i+1]:
                    hist[f"{bins[i]}-{bins[i+1]}%"] += 1
                    break
        # Category averages
        cat_map = {}
        for r in results:
            cat = r.get("category") or "Uncategorized"
            if r["profit_percentage"] is not None:
                if cat not in cat_map:
                    cat_map[cat] = []
                cat_map[cat].append(r["profit_percentage"])
        cat_avg = {k: sum(v)/len(v) for k, v in cat_map.items() if v}
        # Catalog summary
        summary = {
            "profitable": profitable_count,
            "not_profitable": not_profitable_count,
            "total": profitable_count + not_profitable_count
        }
        return {
            "results": results,
            "top5": top5,
            "histogram": hist,
            "category_averages": cat_avg,
            "summary": summary
        }
    except HTTPException:
        raise
    except Exception as e:
        print("==== BACKEND ERROR ====")
        traceback.print_exc()
        print("======================")
        raise HTTPException(status_code=500, detail=str(e))

def process_file_background(file_content: bytes, upload_id: str):
    loop = None
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        dashboard_data = loop.run_until_complete(process_file(file_content, upload_id=upload_id))
        global_results[upload_id] = dashboard_data
    except Exception as e:
        global_results[upload_id] = {"error": str(e)}
    finally:
        if loop:
            loop.close()

@app.post("/process")
async def process_upload(file: UploadFile = File(...)):
    print("==== /process endpoint called ====")
    if not file.filename.endswith((".xlsx", ".csv")):
        raise HTTPException(status_code=400, detail="File must be Excel (.xlsx) or CSV (.csv)")
    try:
        contents = await file.read()
        upload_id = str(uuid.uuid4())
        # Start processing in background thread
        t = threading.Thread(target=process_file_background, args=(contents, upload_id))
        t.start()
        # Initialize progress
        global_progress[upload_id] = {
            'rows_processed': 0,
            'total_rows': 1,
            'start_time': time.time(),
            'last_update_time': time.time(),
            'eta_seconds': None,
            'done': False
        }
        return {"upload_id": upload_id}
    except Exception as e:
        print("==== PROCESS UPLOAD ERROR ====")
        traceback.print_exc()
        print("==============================")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/progress/{upload_id}")
def get_progress(upload_id: str):
    prog = global_progress.get(upload_id)
    if not prog:
        return {"error": "Invalid upload_id or no progress yet."}
    return {
        "rows_processed": prog['rows_processed'],
        "total_rows": prog['total_rows'],
        "eta_seconds": prog['eta_seconds'],
        "done": prog['done']
    }

@app.get("/results/{upload_id}")
def get_results(upload_id: str):
    res = global_results.get(upload_id)
    if not res:
        return {"error": "Results not ready yet."}
    return res

@app.get("/")
async def read_root():
    return {"message": "Amazon Profit Calculator API"} 