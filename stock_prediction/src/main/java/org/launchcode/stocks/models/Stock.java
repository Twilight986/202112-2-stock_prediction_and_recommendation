package org.launchcode.stocks.models;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;

/**
 * Created by Chris Bay on 5/15/15.
 */

/**
 * Represents the stock for a particular company. Encapsulates the stock symbol, company name, and current price.
 */
public class Stock {

    private final String symbol;
    private final float price;
    private final String name;

    private Stock(String symbol, String name, float price) {
        this.symbol = symbol;
        this.price = price;
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public float getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return getName() + " (" + getSymbol() + ")";
    }


    private static final String urlBase = "http://download.finance.yahoo.com/d/quotes.csv?f=snl1&s=";

    /**
     * Factory to create new Stock instances with current price information.
     *
     * @param symbol    stock symbol
     * @return          Stock instance with current price information, if available, null otherwise
     */
    public static Stock lookupStock(String symbol) throws StockLookupException {

        // Assemble the URL to query from Yahoo Finance
        URL url;
        try {
            url = new URL(urlBase + symbol);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            throw new StockLookupException("Problem resolving URL", symbol);
        }

        // Fetch the CSV data
        CSVParser parser;
        CSVRecord stockInfo;
        try {
            parser = CSVParser.parse(url, Charset.forName("UTF-8"), CSVFormat.DEFAULT);

            // We expect a single record, so get the first one
            stockInfo = parser.getRecords().get(0);
            parser.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new StockLookupException("Problem parsing fetched data", symbol);
        }

        // stockInfo should be a collection like { "YHOO", "Yahoo, Inc.", 123.45 }

        // if Yahoo could not find the symbol, we'll get { symbol, "N/A", "N/A" }
        if (stockInfo.get(1).equals("N/A") || stockInfo.get(2).equals("N/A")) {
            throw new StockLookupException("Not a valid stock symbol", symbol);
        }

        return new Stock(stockInfo.get(0), stockInfo.get(1), Float.parseFloat(stockInfo.get(2)));
    }

}