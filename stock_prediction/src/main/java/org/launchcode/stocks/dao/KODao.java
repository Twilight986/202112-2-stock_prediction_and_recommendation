package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.KO;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:09
 */
public interface KODao {
    List<KO> selectKOByWeek(List<String> dayList);
}
