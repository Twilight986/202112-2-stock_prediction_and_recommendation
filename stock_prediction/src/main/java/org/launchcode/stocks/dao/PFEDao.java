package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.PFE;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:11
 */
public interface PFEDao {
    List<PFE> selectPFEByWeek(List<String> dayList);
}
