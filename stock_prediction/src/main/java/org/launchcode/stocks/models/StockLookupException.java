package org.launchcode.stocks.models;

/**
 * Created by Chris Bay on 5/17/15.
 */
@SuppressWarnings("serial")
public class StockLookupException extends Exception {

    private String symbol;

    public StockLookupException(){}

    public StockLookupException(String message, String symbol) {
        super(message);
    }

    public StockLookupException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public String getMessage() {
        return super.getMessage() + "Unable to lookup data for stock: " + symbol;
    }

    public String getSymbol() {
        return symbol;
    }
}
