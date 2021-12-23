package org.launchcode.stocks.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 2:03
 */
public class GetWeek {
    public List<String> getWeekDate() {
        List<String> daylist = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/M/d");

        Calendar cal = Calendar.getInstance();
        cal.setFirstDayOfWeek(Calendar.MONDAY);
        int dayWeek = cal.get(Calendar.DAY_OF_WEEK);
        if(dayWeek==1){
            dayWeek = 8;
        }

        cal.add(Calendar.DATE, cal.getFirstDayOfWeek() - dayWeek);
        Date mondayDate = cal.getTime();
        String weekBegin = sdf.format(mondayDate);
        daylist.add(weekBegin);
        for (int i = 0; i < 6; i++){
            cal.add(Calendar.DATE, 1);
            Date sundayDate = cal.getTime();
            String day = sdf.format(sundayDate);
            daylist.add(day);
        }
        return daylist;
    }

    public List<String> getNextWeekDate() {
        List<String> daylist = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/M/d");

        Calendar cal = Calendar.getInstance();
        cal.setFirstDayOfWeek(Calendar.MONDAY);
        int dayWeek = cal.get(Calendar.DAY_OF_WEEK);
        if(dayWeek==1){
            dayWeek = 8;
        }

        cal.add(Calendar.DATE, cal.getFirstDayOfWeek() - dayWeek + 7);
        Date mondayDate = cal.getTime();
        String weekBegin = sdf.format(mondayDate);
        daylist.add(weekBegin);
        for (int i = 0; i < 6; i++){
            cal.add(Calendar.DATE, 1);
            Date sundayDate = cal.getTime();
            String day = sdf.format(sundayDate);
            daylist.add(day);
        }
        return daylist;
    }
}
