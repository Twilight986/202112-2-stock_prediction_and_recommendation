package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.TLSA;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:12
 */
public interface TLSADao {
    List<TLSA> selectTLSAByWeek(List<String> dayList);
}
