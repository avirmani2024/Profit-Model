import pandas as pd
from rapidfuzz import fuzz
import re

"""
filter_output.py

Reads "output.csv" (the raw scraper results), filters each row’s 10 scraped results
to keep only those whose titles fuzzily match the original product description,
and writes a new CSV ("filtered_output.csv") with:

  • Product
  • Wholesale Price
  • Result1 ASIN, Result1 Name, Result1 Price, …, Result10 ASIN, Result10 Name, Result10 Price
    (but each “ResultX” is blanked unless it passed the fuzzy‐match threshold)
  • AvgRelatedPrice (average price of the matched results; blank if no matches)

Assumptions:
  • "output.csv" contains columns:
      Product, Wholesale Price,
      Result1 ASIN, Result1 Name, Result1 Price,
      …,
      Result10 ASIN, Result10 Name, Result10 Price
  • We use a token_set_ratio threshold to decide if a scraped title is “related.”

Requirements:
  pip install pandas rapidfuzz

Usage:
  python filter_output.py
"""

# Adjust this threshold as needed (0–100).
SIMILARITY_THRESHOLD = 45


def extract_numeric_price(price_str: str) -> float:
    """
    Convert a price string like "$34.99" or "$1,299.00" to a float (34.99, 1299.00).
    If price_str is empty or invalid, return None to skip it in averaging.
    """
    if not isinstance(price_str, str) or not price_str.strip():
        return None
    # Remove any character except digits and dot
    cleaned = re.sub(r"[^\d.]", "", price_str)
    try:
        return float(cleaned)
    except ValueError:
        return None


def main():
    # Load the raw scraper results
    df = pd.read_csv("output.csv")

    # Prepare new DataFrame with same columns plus AvgRelatedPrice
    base_cols = ["Product", "Wholesale Price"]
    result_cols = []
    for i in range(1, 11):
        result_cols += [
            f"Result{i} ASIN",
            f"Result{i} Name",
            f"Result{i} Price",
        ]
    all_cols = base_cols + result_cols + ["AvgRelatedPrice"]

    filtered_rows = []

    for idx, row in df.iterrows():
        product_name = str(row["Product"])
        wholesale_price = row.get("Wholesale Price", "")

        matched_prices = []

        new_row = {
            "Product": product_name,
            "Wholesale Price": wholesale_price,
            # Initialize all result columns to blank
            **{col: "" for col in result_cols},
            "AvgRelatedPrice": ""
        }

        # For each of the 10 scraped results, check fuzzy match
        for i in range(1, 11):
            asin_col = f"Result{i} ASIN"
            name_col = f"Result{i} Name"
            price_col = f"Result{i} Price"

            scraped_title = str(row.get(name_col, "")).strip()
            scraped_price = str(row.get(price_col, "")).strip()

            if scraped_title:
                # Compute fuzzy similarity
                score = fuzz.token_set_ratio(product_name.lower(), scraped_title.lower())
                if score >= SIMILARITY_THRESHOLD:
                    # Keep this result in the new CSV
                    new_row[asin_col] = row.get(asin_col, "")
                    new_row[name_col] = scraped_title
                    new_row[price_col] = scraped_price

                    # Convert scraped_price to float (if valid) and store for averaging
                    numeric = extract_numeric_price(scraped_price)
                    if numeric is not None:
                        matched_prices.append(numeric)
                # else: leave new_row[*] as blank
            # else: leave as blank

        # Compute average price if we have any matched prices
        if matched_prices:
            avg_price = sum(matched_prices) / len(matched_prices)
            new_row["AvgRelatedPrice"] = f"${avg_price:.2f}"

        filtered_rows.append(new_row)

    # Build DataFrame and save to a new CSV
    filtered_df = pd.DataFrame(filtered_rows, columns=all_cols)
    filtered_df.to_csv("filtered_output.csv", index=False)
    print("✅ 'filtered_output.csv' written with only matched results and average price.")


if __name__ == "__main__":
    main()
