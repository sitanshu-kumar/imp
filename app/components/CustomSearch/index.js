/* eslint-disable no-underscore-dangle */
/**
 *
 * CustomSearch
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Input } from 'antd';
import ModuleService from '../../utils/services/ModuleService';

function CustomSearch(props) {
  // const {  } = props;

  const [searchKey, setSearchKey] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    async function searchData() {
      const payload = {
        page: 0,
        perPage: 10,
      };

      if (searchKey) {
        // payload.search = searchState.searchText;
        payload.criteria = {
          [props.searchKey]: {
            $regex: `^${searchKey}`,
            $options: 'i',
          },
        };
      }

      const [, response] = await ModuleService.getModule(props.module, payload);
      if (response) {
        if (response.data) {
          setData([...response.data]);
        }
      }
    }

    searchData();
    console.log('searchKey', searchKey);
  }, [searchKey, props.module, props.searchKey]);

  const onSearch = e => {
    if (props.module) {
      setSearchKey(e.target.value ? e.target.value : '');
    } else if (props.onChange) {
      props.onChange(e);
    }
  };

  const onselect = item => {
    if (props.onChange) {
      props.onChange({
        target: {
          value: item[props.searchKey],
          id: item._id,
        },
      });
    }
  };
  return (
    <div>
      <Input {...props} onChange={onSearch} />
      {data.map((item,index) => (
        <p key={index+"_search_"+item._id} cursor="pointer" onClick={() => onselect(item)}>
          {item[props.searchKey]}
        </p>
      ))}
    </div>
  );
}

CustomSearch.propTypes = {
  onChange: PropTypes.func,
  module: PropTypes.string,
  searchKey: PropTypes.string,
};

export default CustomSearch;
