package org.launchcode.stocks.dao;

import javax.transaction.Transactional;

import org.launchcode.stocks.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/14 - 16:56
 */
@Transactional
@Repository
public interface UserDao extends CrudRepository<User, Integer> {

    User findByUserName(String userName);

    User findByUid(int uid);

}
