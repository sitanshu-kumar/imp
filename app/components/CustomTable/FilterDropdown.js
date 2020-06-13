import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Table, Modal, message, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default FilterDropdown => ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}) => {
  console.log({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  });

  const searchInput = useRef(null);

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => handleReset(clearFilters)}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  );
};
