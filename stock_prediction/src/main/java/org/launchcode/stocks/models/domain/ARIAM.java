package org.launchcode.stocks.models.domain;

import org.springframework.data.annotation.Id;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 19:52
 */
@Entity
@Table(name = "ariam_pred")
public class ARIAM implements Serializable {

    private int id;
    private String date;
    private String name;
    private float pred;

    @javax.persistence.Id
    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "date")
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "pred")
    public float getPred() {
        return pred;
    }

    public void setPred(float pred) {
        this.pred = pred;
    }
}
