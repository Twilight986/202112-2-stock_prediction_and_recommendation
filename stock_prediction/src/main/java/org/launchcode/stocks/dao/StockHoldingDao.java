package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.StockHolding;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

/**
 * Created by Chris Bay on 5/17/15.
 */
@Transactional
@Repository
public interface StockHoldingDao extends CrudRepository<StockHolding, Integer> {

    StockHolding findBySymbolAndOwnerId(String symbol, int ownerId);

}
