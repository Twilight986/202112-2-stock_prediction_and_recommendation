package org.launchcode.stocks.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * Created by cbay on 5/10/15.
 */

/**
 * Represents a user's ownership stake in a particular stock
 */
@Entity
@Table(name = "stock_holdings")
public class StockHolding extends AbstractEntity {

    private String symbol;
    private int sharesOwned;
    private int ownerId;

    /**
     * The history of past transactions in which this user bought or sold shares from this stock holding
     */
    private List<StockTransaction> transactions;



    private StockHolding() {}

    private StockHolding(String symbol, int ownerId) {
        // TODO - make sure symbol is always upper or lowercase (your choice)
        this.symbol = symbol.toUpperCase();
        this.sharesOwned = 0;
        this.ownerId = ownerId;
        transactions = new ArrayList<StockTransaction>();
    }

    @NotNull
    @Column(name = "owner_id")
    public int getOwnerId(){
        return ownerId;
    }

    protected void setOwnerId(int ownerId){
        this.ownerId = ownerId;
    }

    @NotNull
    @Column(name = "symbol")
    public String getSymbol() {
        return symbol;
    }

    protected void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    @NotNull
    @Column(name = "shares_owned")
    public int getSharesOwned() {
        return sharesOwned;
    }

    protected void setSharesOwned(int sharesOwned) {
        this.sharesOwned = sharesOwned;
    }

    @OneToMany(mappedBy = "stockHolding", cascade = CascadeType.ALL)
    public List<StockTransaction> getTransactions() {
        return transactions;
    }

    protected void setTransactions(List<StockTransaction> transactions) {
        this.transactions = transactions;
    }

    /**
     * Instance method for buying shares of a holding
     *
     * @param numberOfShares
     * @throws IllegalArgumentException if numberOfShares < 0
     * @throws StockLookupException     if unable to lookup stock info
     */
    private void buyShares(int numberOfShares) throws StockLookupException {

        if (numberOfShares < 0) {
            throw new IllegalArgumentException("Can not purchase a negative number of shares.");
        }

        setSharesOwned(sharesOwned + numberOfShares);

        StockTransaction transaction = new StockTransaction(this, numberOfShares, StockTransaction.TransactionType.BUY);
        this.transactions.add(transaction);
    }

    /**
     * Instance method for selling shares of a holding
     *
     * @param numberOfShares
     * @throws IllegalArgumentException if numberOfShares greater than shares owned
     * @throws StockLookupException     if unable to lookup stock info
     */
    private void sellShares(int numberOfShares) throws StockLookupException {

        if (numberOfShares > sharesOwned) {
            throw new IllegalArgumentException("Number to sell exceeds shares owned for stock" + symbol);
        }

        setSharesOwned(sharesOwned - numberOfShares);

        StockTransaction transaction = new StockTransaction(this, numberOfShares, StockTransaction.TransactionType.SELL);
        this.transactions.add(transaction);
    }

    /**
     * Static method for buying shares of a StockHolding. Creates a new holding if the user did not already have one,
     * otherwise simply updates sharesOwned on the existing holding
     *
     * @param user              user to buy the stock
     * @param symbol            symbol of the stock to buy
     * @param numberOfShares    number of shares to buy
     * @return                  the holding for the user and symbol
     * @throws IllegalArgumentException
     */
    public static StockHolding buyShares(User user, String symbol, int numberOfShares) throws StockLookupException {

        // TODO - make sure symbol matches case convention

        // Get existing holding
        Map<String, StockHolding> userPortfolio = user.getPortfolio();
        StockHolding holding;

        // Create new holding, if user has never owned the stock before
        if (!userPortfolio.containsKey(symbol)) {
            holding = new StockHolding(symbol, user.getUid());
            user.addHolding(holding);
        }

        // Conduct buy
        holding = userPortfolio.get(symbol);
        holding.buyShares(numberOfShares);
        
       // TODO - update user cash on buy

        return holding;
    }

    /**
     * Static method for selling shares of a StockHolding.
     *
     * @param user              owner of the holding
     * @param symbol            symbol of the holding to sell
     * @param numberOfShares    number of shares to sell
     * @return                  the given holding for symbol and user, or null if user has never owned any of symbol's stock
     * @throws IllegalArgumentException
     */
    public static StockHolding sellShares(User user, String symbol, int numberOfShares) throws StockLookupException {

        // TODO - make sure symbol matches case convention

        // Get existing holding
        Map<String, StockHolding> userPortfolio = user.getPortfolio();
        StockHolding holding;

        if (!userPortfolio.containsKey(symbol)) {
            return null;
        }

        // Conduct sale
        holding = userPortfolio.get(symbol);
        holding.sellShares(numberOfShares);

        // TODO - update user cash on sale

        return holding;
    }
}
