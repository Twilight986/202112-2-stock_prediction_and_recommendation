package org.launchcode.stocks.service;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:30
 */
public interface StockHistoryService<T> {
    List<T> getWeeklyHistoryData(List<String> dayList);
}
