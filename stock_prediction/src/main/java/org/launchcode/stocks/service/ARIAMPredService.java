package org.launchcode.stocks.service;

import org.launchcode.stocks.models.domain.*;

import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 21:37
 */
public interface ARIAMPredService {
    List<AAPL> getAAPLWeekPred(List<String> daylist);

    List<KO> getKOWeekPred(List<String> daylist);

    List<NVDA> getNVDAWeekPred(List<String> daylist);

    List<PFE> getPFEWeekPred(List<String> daylist);

    List<TLSA> getTLSAWeekPred(List<String> daylist);
}
