package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.StockTransaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by Chris Bay on 5/17/15.
 */

@Transactional
@Repository
public interface StockTransactionDao extends CrudRepository<StockTransaction, Integer> {

    List<StockTransaction> findBySymbolAndUid(String symbol, int uid);

}
