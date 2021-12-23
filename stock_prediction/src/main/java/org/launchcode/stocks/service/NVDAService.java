package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.NVDA;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 22:20
 */
public interface NVDAService {
    List<NVDA> getWeeklyHistoryData(List<String> dayList);
}
