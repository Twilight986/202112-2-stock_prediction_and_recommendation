package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.AAPL;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 22:19
 */
public interface AAPLService {
    List<AAPL> getWeeklyHistoryData(List<String> dayList);
}
