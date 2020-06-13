/* eslint-disable no-underscore-dangle */
/**
 *
 * CustomSelect
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import ModuleService from '../../utils/services/ModuleService';
// import styled from 'styled-components';

const { Option } = Select;

function CustomSelect(props) {
  const {
    placeholder,
    showKey,
    serverKey,
    loadFromApi,
    module,
    criteria,
  } = props;
  const [optionsData, setOptionsData] = useState(props.optionsData || []);

  const [stateCritaria, setStateCritaria] = useState(criteria);

  const handleChange = value => {
    const selectedItem = optionsData.filter(item => item._id === value)[0];
    // setSelectedValue(selectedValue);
    props.afterSelect(value, selectedItem);
  };

  useEffect(() => {
    async function loadModuleData() {
      const payload = {
        page: 0,
        perPage: 100,
      };
      if (criteria) {
        payload.criteria = JSON.stringify(criteria);
      }
      if (props.sortKey && props.sortOrder) {
        payload.sortKey = props.sortKey;
        payload.sortOrder = props.sortOrder;
      }
      const [, response] = await ModuleService.getModule(module, payload);
      if (response && response.data) {
        if (optionsData.length && response.data.length) {
          props.afterSelect(response.data[0][serverKey], response.data[0]);
        }

        setOptionsData(response.data);
      }
    }
    if (loadFromApi && module) {
      loadModuleData();
    }
  }, [stateCritaria]);

  useEffect(() => {
    if (criteria) {
      let isCritariaChanged = false;

      Object.keys(criteria).forEach(key => {
        if (criteria[key] !== stateCritaria[key]) {
          isCritariaChanged = true;
        }
      });

      if (isCritariaChanged) {
        setStateCritaria({ ...criteria });
      }
    }
  }, [criteria]);

  return (
    <div>
      <Select
        {...props}
        style={{ width: '100%' }}
        placeholder={placeholder}
        onChange={handleChange}
      >
        {optionsData.map(d => (
          <Option key={d[serverKey]}>{d[showKey]}</Option>
        ))}
      </Select>
    </div>
  );
}

CustomSelect.propTypes = {
  mode: PropTypes.string,
  placeholder: PropTypes.string,
  showKey: PropTypes.string,
  serverKey: PropTypes.string,
  loadFromApi: PropTypes.bool,
  module: PropTypes.string,
  optionsData: PropTypes.array,
  criteria: PropTypes.any,
  afterSelect: PropTypes.func,
  sortOrder: PropTypes.string,
  sortKey: PropTypes.string,
};

export default memo(CustomSelect);
