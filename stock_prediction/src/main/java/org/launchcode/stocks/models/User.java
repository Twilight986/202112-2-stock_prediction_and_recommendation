package org.launchcode.stocks.models;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.launchcode.stocks.util.PasswordHash;

/**
 * Created by cbay on 5/10/15.
 */

/**
 * Represents a user on our site
 */
@Entity
@Table(name = "users")
public class User extends AbstractEntity {

    private String userName;
    private String hash;

    /**
     * A collection of all the StockHoldings this user owns. The keys are stock symbols, ie "YHOO"
     */
    private Map<String, StockHolding> portfolio;

    // TODO - add cash to user class

    public User(String userName, String password) {
        this.hash = PasswordHash.getHash(password);
        this.userName = userName;
        this.portfolio = new HashMap<String, StockHolding>();
    }

    // empty constructor so Hibernate can do its magic
    public User() {}

    @NotNull
    @Column(name = "username", unique = true)
    public String getUserName() {
        return userName;
    }

    protected void setUserName(String userName){
        this.userName = userName;
    }

    @NotNull
    @Column(name = "hash")
    public String getHash() {
        return hash;
    }

    protected void setHash(String hash) {
        this.hash = hash;
    }

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id")
    public Map<String, StockHolding> getPortfolio() {
        return portfolio;
    }

    @SuppressWarnings("unused")
	private void setPortfolio(Map<String, StockHolding> portfolio) {
        this.portfolio = portfolio;
    }

    void addHolding (StockHolding holding) throws IllegalArgumentException {

        // Ensure a holding for the symbol doesn't already exist
        if (portfolio.containsKey(holding.getSymbol())) {
            throw new IllegalArgumentException("A holding for symbol " + holding.getSymbol()
                    + " already exits for user " + getUid());
        }

        portfolio.put(holding.getSymbol(), holding);
    }

}
