package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.TLSA;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 22:22
 */
public interface TLSAService {
    List<TLSA> getWeeklyHistoryData(List<String> dayList);
}
