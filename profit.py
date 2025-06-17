import pandas as pd
import re

"""
profitability.py

Reads "filtered_output.csv" (which must contain columns:
  - "Product"
  - "Wholesale Price"
  - "AvgRelatedPrice" (formatted like "$XX.XX" or blank)

Computes, for each product:
  ProfitPercentage = ((AvgPrice - WholesalePrice) / WholesalePrice) * 100
  Profitable       = "Yes" if ProfitPercentage ≥ 25, else "No"

Outputs a new CSV "profitability.csv" with columns:
  Product | Wholesale Price | AvgRelatedPrice | ProfitPercentage | Profitable

Requirements:
  pip install pandas
"""


def parse_price(price_str):
    """
    Convert a price string like "$34.99" or "34.99" to a float 34.99.
    If the string is empty or cannot be parsed, return None.
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
    # 1) Load filtered results
    df = pd.read_csv("filtered_output.csv")

    # 2) Prepare lists to collect computed values
    profit_percentages = []
    profitable_flags = []

    # 3) Process each row
    for _, row in df.iterrows():
        wholesale_raw = row.get("Wholesale Price", "")
        avg_raw = row.get("AvgRelatedPrice", "")

        # Parse wholesale price and average price into floats
        wholesale = None
        if pd.notna(wholesale_raw):
            try:
                wholesale = float(wholesale_raw)
            except:
                wholesale = parse_price(str(wholesale_raw))

        avg_price = parse_price(str(avg_raw))

        # Compute profit percentage if both prices are valid and wholesale>0
        if wholesale and wholesale > 0 and avg_price is not None:
            profit_pct = ((avg_price - wholesale) / wholesale) * 100
            # Round to two decimal places
            profit_pct = round(profit_pct, 2)
        else:
            profit_pct = None

        # Determine if profitable (≥ 25%)
        if profit_pct is not None and profit_pct >= 25.0:
            profitable = "Yes"
        else:
            profitable = "No"

        profit_percentages.append(profit_pct if profit_pct is not None else "")
        profitable_flags.append(profitable)

    # 4) Build output DataFrame
    output_df = pd.DataFrame({
        "Product": df["Product"],
        "Wholesale Price": df["Wholesale Price"],
        "AvgRelatedPrice": df["AvgRelatedPrice"],
        "ProfitPercentage": profit_percentages,
        "Profitable": profitable_flags
    })

    # 5) Save to CSV
    output_df.to_csv("profitability.csv", index=False)
    print("✅ 'profitability.csv' has been created with profit percentages and profitability flags.")


if __name__ == "__main__":
    main()
