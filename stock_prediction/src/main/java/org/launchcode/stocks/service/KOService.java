package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.KO;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 22:20
 */
public interface KOService {
    List<KO> getWeeklyHistoryData(List<String> dayList);
}
