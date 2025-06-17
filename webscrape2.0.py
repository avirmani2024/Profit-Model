import pandas as pd
import time
import subprocess
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

"""
webscrape.py

This script:
  1) Reads "Medical Supplies Catalog (1).xlsx" (column "Description").
  2) Launches a visible Chrome via Selenium (so you can see exactly what Amazon is serving).
  3) Searches Amazon for each product name.
  4) Waits 5 seconds for the page to load fully (giving Amazon more time to render).
  5) Prints debug info (ChromeDriver ↔ Chrome versions, page title, HTML snippet).
  6) Scrapes, for the first 10 results:
        • ASIN (data-asin attribute)
        • Full product title (by concatenating all <span> texts inside <h2>)
        • Price (from <span class="a-offscreen"> if available)
  7) Pads each list to length 10 with empty strings if fewer than 10 results are found.
  8) Writes each row incrementally to "output.csv" so you can watch data being appended live.

Columns in output.csv:
  Product | Wholesale Price |
  Result1 ASIN | Result1 Name | Result1 Price | … | Result10 ASIN | Result10 Name | Result10 Price

Requirements:
    pip install pandas selenium webdriver-manager openpyxl

Usage:
    python webscrape.py
"""

def print_chrome_versions():
    """
    Prints which ChromeDriver binary is being used and attempts to detect your local Chrome version.
    """
    try:
        chromedriver_path = ChromeDriverManager().install()
        print("➤ ChromeDriver binary:", chromedriver_path)
    except Exception as e:
        print("‼️ Could not auto-install ChromeDriver via webdriver_manager:", e)

    for cmd in ["google-chrome --version", "chrome --version", "chromium-browser --version", "chromium --version"]:
        try:
            version_output = subprocess.check_output(cmd.split(), stderr=subprocess.STDOUT)
            print("➤ Detected browser version:", version_output.decode().strip())
            break
        except Exception:
            pass
    else:
        print("⚠️ Could not detect local Chrome version via command line.")


def setup_driver():
    chrome_options = Options()

    # ─── RUN IN NON-HEADLESS MODE ───────────────────────────────────────────────
    # Comment out these three lines to enable headless later:
    # chrome_options.add_argument("--headless")
    # chrome_options.add_argument("--disable-gpu")
    # chrome_options.add_argument("--no-sandbox")
    # ──────────────────────────────────────────────────────────────────────────────

    # For now, run in visible mode so you can watch what Amazon serves:
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")

    # These two flags help disguise headless if you re-enable it later:
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")

    # A realistic, up-to-date desktop User-Agent (Chrome 115 on Windows 10).
    # Adjust this if your local Chrome version is different.
    chrome_options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/115.0.5790.102 Safari/537.36'
    )

    # ─── INSTALL ChromeDriver ──────────────────────────────────────────────────
    service = Service(ChromeDriverManager().install())
    # If you need to pin a specific driver version, replace with:
    # service = Service(ChromeDriverManager(driver_version="115.0.5790.102").install())
    # ──────────────────────────────────────────────────────────────────────────────

    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver


def scrape_amazon_top_10(driver, search_term):
    """
    Search Amazon for `search_term` and return lists of:
      • asins   (length 10)
      • titles  (length 10)
      • prices  (length 10)

    Waits 5 seconds to allow the page to load, then prints debug info.
    """
    query = search_term.replace(' ', '+')
    url = f"https://www.amazon.com/s?k={query}"
    driver.get(url)

    # Wait 5 seconds so Amazon’s page has time to fully load all JavaScript & images
    time.sleep(5)

    # ─── DEBUG PRINTS ───────────────────────────────────────────────────────────
    print(f"    ► DEBUG: loaded URL  : {url}")
    print(f"    ► DEBUG: page title  : {driver.title}")
    snippet = driver.page_source[:300].replace("\n", " ").replace("\r", " ")
    print(f"    ► DEBUG: HTML snippet: {snippet}\n")
    # ─────────────────────────────────────────────────────────────────────────────

    asins = []
    titles = []
    prices = []

    # Grab every <div data-component-type="s-search-result"> container
    results = driver.find_elements(By.XPATH, "//div[@data-component-type='s-search-result']")

    for item in results:
        if len(asins) >= 10:
            break

        # 1) Extract ASIN from data-asin attribute
        asin = item.get_attribute("data-asin") or ""
        if not asin:
            continue

        # 2) Full product title: concatenate all <span> texts inside the <h2> tag
        try:
            span_elems = item.find_elements(By.XPATH, ".//h2//span")
            # Join non-empty span texts with a space
            full_title = " ".join([sp.text.strip() for sp in span_elems if sp.text.strip()])
            if not full_title:
                continue
        except:
            continue

        # 3) Extract price: <span class="a-offscreen"> contains the full price if available
        try:
            price_el = item.find_element(By.XPATH, ".//span[@class='a-offscreen']")
            full_price = price_el.get_attribute("innerText").strip()
        except:
            full_price = ""

        asins.append(asin)
        titles.append(full_title)
        prices.append(full_price)

    # Pad out to exactly 10 results with empty strings if fewer are found
    while len(asins) < 10:
        asins.append("")
        titles.append("")
        prices.append("")

    return asins, titles, prices


def main():
    # STEP 1: Print ChromeDriver & Chrome browser versions for troubleshooting
    print_chrome_versions()
    print("\nStarting the scraper...\n")

    # STEP 2: Read the Excel file (skip first two rows; adjust header= if needed)
    input_df = pd.read_excel("Medical Supplies Catalog (1).xlsx", header=2)
    input_df = input_df.dropna(subset=['Description'])

    # STEP 3: Prepare the output CSV with headers, so we can append rows as we go
    base_cols = ['Product', 'Wholesale Price']
    result_cols = []
    for i in range(1, 11):
        result_cols += [
            f'Result{i} ASIN',
            f'Result{i} Name',
            f'Result{i} Price'
        ]
    all_columns = base_cols + result_cols
    pd.DataFrame(columns=all_columns).to_csv("output.csv", index=False)

    # STEP 4: Launch Selenium/Chrome
    driver = setup_driver()

    total = len(input_df)
    for idx, row in input_df.iterrows():
        search_term = row['Description']
        wholesale_price = row.get('Starting Wholesale Price', "")

        print(f"\nScraping row {idx+1}/{total}: '{search_term}'")
        asins, titles, costs = scrape_amazon_top_10(driver, search_term)

        non_empty = sum(1 for t in titles if t.strip())
        print(f"    → Found {non_empty} product titles (padding to 10).")

        # STEP 5: Build the row dictionary
        row_dict = {
            'Product': search_term,
            'Wholesale Price': wholesale_price
        }
        for i in range(10):
            row_dict[f'Result{i+1} ASIN']  = asins[i]
            row_dict[f'Result{i+1} Name']  = titles[i]
            row_dict[f'Result{i+1} Price'] = costs[i]

        # STEP 6: Append this dictionary as a single row to "output.csv"
        pd.DataFrame([row_dict]).to_csv(
            "output.csv",
            mode='a',       # append mode
            header=False,   # do not write header again
            index=False
        )

        # OPTIONAL: extra delay if Amazon is still rate-limiting
        # time.sleep(2)

    driver.quit()

    print("\n✅ Scraping complete! 'output.csv' has been written incrementally.\n")


if __name__ == "__main__":
    main()
