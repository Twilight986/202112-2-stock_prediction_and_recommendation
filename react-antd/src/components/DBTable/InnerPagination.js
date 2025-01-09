import React from 'react';
import {Pagination, Select} from 'antd';

/**
 */
class InnerPagination extends React.PureComponent {

  render() {
    return (
      <div className="db-pagination">
        <Pagination
          showQuickJumper
          selectComponentClass={Select}
          total={this.props.total}
          showTotal={(total) => `Each Page has${this.props.pageSize}rows. the total is ${total}`}
          pageSize={this.props.pageSize} defaultCurrent={1}
          current={this.props.currentPage}
          onChange={this.props.parentHandlePageChange}
          showSizeChanger={this.props.showSizeChanger}
          onShowSizeChange={this.props.parentHandleShowPageChange}
          pageSizeOptions={this.props.pageSizeOptions}
        />
      </div>
    );
  }

}

export default InnerPagination;
