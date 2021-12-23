package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 20:02
 */
@Component
public interface ARIAMDao {
    List<AAPL> selectAAPLPredData(List<String> daylist);

    List<KO> selectKOPredData(List<String> daylist);

    List<NVDA> selectNVDAPredData(List<String> daylist);

    List<PFE> selectPFEPredData(List<String> daylist);

    List<TLSA> selectTLSAPredData(List<String> daylist);

}
