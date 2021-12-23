package org.launchcode.stocks.models.domain;

import org.launchcode.stocks.models.StockHistoryAbstract;
import org.springframework.data.annotation.Id;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/15 - 14:15
 */
@Entity
@Table(name = "nvda")
public class NVDA implements Serializable {
    private String date;
    private float open;
    private float high;
    private float low;
    private float close;
    private float adjClose;
    private int vol;

    @javax.persistence.Id
    @Id
    @Column(name = "date")
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @Column(name = "open")
    public float getOpen() {
        return open;
    }

    public void setOpen(float open) {
        this.open = open;
    }

    @Column(name = "high")
    public float getHigh() {
        return high;
    }

    public void setHigh(float high) {
        this.high = high;
    }

    @Column(name = "low")
    public float getLow() {
        return low;
    }

    public void setLow(float low) {
        this.low = low;
    }

    @Column(name = "close")
    public float getClose() {
        return close;
    }

    public void setClose(float close) {
        this.close = close;
    }

    @Column(name = "adj_close")
    public float getAdjClose() {
        return adjClose;
    }

    public void setAdjClose(float adjClose) {
        this.adjClose = adjClose;
    }

    @Column(name = "vol")
    public int getVol() {
        return vol;
    }

    public void setVol(int vol) {
        this.vol = vol;
    }
}
