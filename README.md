# Amazon Profit Calculator

A full-stack web application designed for Amazon FBM and FBA sellers to analyze product profitability. The tool allows users to upload their product catalog and automatically matches products with Amazon listings, calculating potential profit margins.

## Features

- Upload Excel/CSV files with product descriptions and wholesale prices
- Automatic Amazon product matching
- Profit margin calculation including Amazon fees
- Clean, modern user interface
- Real-time processing status updates

## Prerequisites

- Python 3.8+
- Node.js 14+
- Chrome browser (for web scraping)

## Setup

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn app:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Prepare your Excel/CSV file with the following columns:
   - `Description`: Product name or title
   - `Starting wholesale Price`: Your cost to acquire the item
3. Drag and drop your file onto the upload area or click to select
4. Wait for the processing to complete
5. View the results in the table below, including:
   - Matched Amazon product details
   - Profit calculations
   - Profit margins

## Input File Format

Your input file must be either Excel (.xlsx) or CSV (.csv) format with these required columns:

- `Description`: Product name or title (used for Amazon search)
- `Starting wholesale Price`: Your cost to acquire the item

## Notes

- The application uses Selenium for web scraping, so Chrome must be installed
- Processing time depends on the number of products in your catalog
- Amazon fees are calculated at 15% + $3 shipping buffer
- Results are displayed in real-time as they are processed

---
