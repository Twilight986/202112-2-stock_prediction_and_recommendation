package org.launchcode.stocks.service.impl;

import org.launchcode.stocks.dao.ARIAMDao;
import org.launchcode.stocks.models.domain.*;
import org.launchcode.stocks.service.ARIAMPredService;
import org.launchcode.stocks.util.Constant;
import org.launchcode.stocks.util.ExceptionSender;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 21:45
 */
@Service
public class ARIAMPredImpl implements ARIAMPredService {
    @Resource
    private ARIAMDao ariamDao;


    @Override
    public List<AAPL> getAAPLWeekPred(List<String> daylist) {
        List<AAPL> aaplList = ariamDao.selectAAPLPredData(daylist);
        if (aaplList == null || aaplList.size() == 0){
            throw new ExceptionSender(Constant.NO_PRED_DATA);
        }
        return aaplList;
    }

    @Override
    public List<KO> getKOWeekPred(List<String> daylist) {
        List<KO> koList = ariamDao.selectKOPredData(daylist);
        if (koList == null || koList.size() == 0) {
            throw new ExceptionSender(Constant.NO_PRED_DATA);
        }
        return koList;
    }

    @Override
    public List<NVDA> getNVDAWeekPred(List<String> daylist) {
        List<NVDA> nvdaList = ariamDao.selectNVDAPredData(daylist);
        if (nvdaList == null || nvdaList.size() == 0) {
            throw new ExceptionSender(Constant.NO_PRED_DATA);
        }
        return nvdaList;
    }

    @Override
    public List<PFE> getPFEWeekPred(List<String> daylist) {
        List<PFE> pfeList = ariamDao.selectPFEPredData(daylist);
        if (pfeList == null || pfeList.size() == 0){
            throw new ExceptionSender(Constant.NO_PRED_DATA);
        }
        return pfeList;
    }

    @Override
    public List<TLSA> getTLSAWeekPred(List<String> daylist) {
        List<TLSA> tlsaList = ariamDao.selectTLSAPredData(daylist);
        if (tlsaList == null || tlsaList.size() == 0){
            throw new ExceptionSender(Constant.NO_PRED_DATA);
        }
        return tlsaList;
    }
}
