package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.PFE;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 22:21
 */
public interface PFEService {
    List<PFE> getWeeklyHistoryData(List<String> dayList);
}
