package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.NVDA;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:10
 */
public interface NVDADao {
    List<NVDA> selectNVDAByWeek(List<String> dayList);
}
