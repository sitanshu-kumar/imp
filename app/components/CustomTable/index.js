/**
 *
 * CustomTable
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip, Table, Modal, message, Button } from 'antd';
import { findIndex } from 'lodash';
import { useHistory } from 'react-router-dom';
import {
  SearchOutlined,
  PlusOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Icon } from '@ant-design/compatible';
import ModuleService from '../../utils/services/ModuleService';
import colors from '../../utils/colors';
import { PrimaryButton } from '../../commonStyles/general';
import CustomSearch from '../CustomSearch';

const { confirm } = Modal;
const StyledIcon = styled(DeleteOutlined)`
  font-size: 16px;
  color: ${colors.primaryDanger};
  margin-right: 10px;
`;
const StyledViewIcon = styled(EyeOutlined)`
  font-size: 16px;
  color: ${colors.primaryColor};
  margin-right: 10px;
`;

const StyledEditIcon = styled(EditOutlined)`
  color: ${colors.primaryBlue};
  font-size: 16px;
  margin-right: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 15px;
`;

const StyledTable = styled(Table)`
  background-color: ${colors.white};
`;
function CustomTable(props) {
  const {
    columns,
    module,
    modalWidth,
    populationKey,
    openCreatePage,
    showBulkButton,
    showViewIcon,
    addText,
    hideDeleteButton,

    hideEditButton,
    showPublishedButtons,
  } = props;
  const history = useHistory();
  const [data, setData] = useState([]);
  const [columnCache, setColumnCache] = useState(columns);
  const [addModalVisible, setAddModal] = useState(false);
  const [editModalVisible, setEditModal] = useState(false);
  const [editContent, setEditContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    page: 0,
  });
  const [sorter, setSorter] = useState({});

  const [deletedIndex, setDeletedIndex] = useState();
  const [publishedId, setPublishedId] = useState();
  const [contentHiddenModal, setContentHiddenModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [searchState, setSearchState] = useState({
    searchText: '',
    searchId: '',
  });

  const searchInput = useRef(null);

  useEffect(() => {
    const actions = {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <div>
          {showViewIcon && (
            <Tooltip title="View" onClick={() => handleView(record)}>
              <StyledViewIcon />
            </Tooltip>
          )}
          {!hideEditButton && !props.noEdit && (
            <Tooltip title="Edit" onClick={() => showEditModal(record)}>
              <StyledEditIcon />
            </Tooltip>
          )}
          {!hideDeleteButton && (
            <Tooltip
              title="Delete"
              onClick={() => deleteConfirmation(record, index)}
            >
              <StyledIcon />
            </Tooltip>
          )}
        </div>
      ),
    };
    columns.push(actions);

    if (showPublishedButtons) {
      const btns = {
        title: 'Publish /Hide',
        key: 'publish',
        width: 150,
        render: (text, record) => (
          <div>
            {!record.isVerified && !record.isAdminCreated ? (
              <Tooltip title="Publish">
                <Button
                  type="primary"
                  style={{ marginBottom: '5px' }}
                  icon={<UploadOutlined />}
                  onClick={() => publishConfirmation(record)}
                >
                  Publish
                </Button>
              </Tooltip>
            ) : (
              <TextSuccess>Published</TextSuccess>
            )}
            {!record.isHidden && !record.isAdminCreated && (
              <Tooltip>
                <Button
                  type="danger"
                  icon={<EyeInvisibleOutlined />}
                  onClick={() => hideContent(record)}
                >
                  Hide
                </Button>
              </Tooltip>
            )}
            {record.isHidden && (
              <p style={{ color: colors.primaryDanger }}>Content Hidden</p>
            )}
          </div>
        ),
      };
      columns.push(btns);
    }

    const modifiedColumns = columns.map(col => {
      if (col.searchable) {
        return {
          ...getColumnSearchProps(
            col.dataIndex || col.dataIndexNew,
            col.searchModel,
            col.searchKey,
          ),
          ...col,
        };
      }
      return col;
    });
    setColumnCache(modifiedColumns);
  }, [columns]);

  const handleView = record => {
    history.push(`/${module}/${record._id}/view`);
  };

  const publishContent = async record => {
    const [error, response] = await ModuleService.updateModule(
      module,
      { isVerified: true },
      record._id,
    );
    if (response && response.data) {
      message.success('Content Published successfully !!');
      setPublishedId(record._id);
    }
    if (error) {
      message.error(error.message);
    }
  };

  const publishConfirmation = record => {
    confirm({
      title: `Are you sure  you want to publish this content ?`,
      content: `Once published , it cannot be undone`,
      icon: <Icon type="exclamation" />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        publishContent(record);
      },
    });
  };

  useEffect(() => {
    const selected = data.filter(item => item._id === publishedId);
    if (selected.length) {
      const i = data.indexOf(selected[0]);
      data[i].isVerified = true;
      setData([...data]);
    }
  }, [publishedId]);
  const hideContent = record => {
    setSelectedData(record);
    setContentHiddenModal(true);
  };

  const afterHideContentSuccess = record => {
    const index = findIndex(data, item => item._id === record._id);
    data[index] = record;
    setData([...data]);
    setContentHiddenModal(false);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    async function loadModuleData() {
      const payload = {
        page: pagination.page,
        perPage: pagination.pageSize,
      };
      if (populationKey) {
        payload.population = JSON.stringify(populationKey);
      }

      if (searchState.searchText) {
        // payload.search = searchState.searchText;

        if (searchState.searchId) {
          let column = searchState.searchedColumn;

          if (Array.isArray(column)) {
            column = column[0];
          }

          payload.criteria = {
            [column]: searchState.searchId,
          };
        } else {
          payload.criteria = {
            [searchState.searchedColumn]: {
              $regex: `^${searchState.searchText}`,
              $options: 'i',
            },
          };
        }
      }

      if (sorter && sorter.field) {
        payload.sortOrder = sorter.order === 'ascend' ? 1 : -1;
        payload.sortKey = sorter.field;
      }

      setLoading(true);
      const [, response] = await ModuleService.getModule(module, payload);
      if (response) {
        if (response.data) {
          setData([...response.data]);
        }

        if (response.extraData) {
          pagination.total = response.extraData.total;
          setPagination({ ...pagination });
        }
      }
      setLoading(false);
    }

    loadModuleData();
  }, [pagination.page, searchState, sorter]);

  const deleteConfirmation = record => {
    confirm({
      title: `Are you sure  you want to delete this ?`,
      icon: <Icon type="exclamation" />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        const [, response] = await ModuleService.deleteModuleId(
          module,
          record._id,
        );
        if (response && response.data) {
          message.success('Deleted succesfully !!');
          setDeletedIndex(record._id);
        }
      },
    });
  };

  const handleSearch = (selectedKeys, confirmSearch, dataIndex) => {
    confirmSearch();

    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchState({ searchText: '' });
  };

  const getColumnSearchProps = (dataIndex, searchModel, searchKey) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <CustomSearch
          module={searchModel}
          searchKey={searchKey}
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            if (e.target.id) {
              setSearchState({
                searchId: e.target.id,
                searchedColumn: dataIndex,
                searchText: e.target.value,
              });
              confirm();
            }
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />

        {!searchModel && (
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
        )}

        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     .toString()
    //     .toLowerCase()
    //     .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        if (searchInput && searchInput.current) {
          setTimeout(() => searchInput.current.select());
        }
      }
    },
    // render: text =>
    //   searchState.searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[this.state.searchText]}
    //       autoEscape
    //       textToHighlight={text.toString()}
    //     />
    //   ) : (
    //       text
    //     ),
  });

  // when item is deleted

  useEffect(() => {
    const deletedItem = data.filter(item => item._id === deletedIndex);

    if (deletedItem.length) {
      const deletedItemIndex = data.indexOf(deletedItem[0]);
      data.splice(deletedItemIndex, 1);
      setData([...data]);
    }
  }, [deletedIndex]);

  // on page change
  const pageChange = (pageData, filters, sorter, extra) => {
    pagination.page = pageData.current - 1;
    setPagination({ ...pagination });
    setSorter({ ...sorter });
  };

  // toggling add modal
  const showAddModal = () => {
    if (openCreatePage) {
      history.push(`/${module}/create`);
    } else {
      setAddModal(true);
    }
  };

  // toggling edit modal

  const showEditModal = record => {
    if (openCreatePage) {
      history.push(`/${module}/${record._id}/edit`);
    } else {
      setEditContent(record);
      setEditModal(!editModalVisible);
    }
  };

  // handling added data and adding on top of data

  const onAddSuccess = addedData => {
    setAddModal(!addModalVisible);
    if (addedData && addedData._id) {
      data.unshift(addedData);
      pagination.total += 1;
      setData([...data]);
      setPagination({ ...pagination });
    }
  };

  // when submit of createForm is clicked , module api is being hit here

  const afterEditSubmit = async (payload, recordId) => {
    const [, response] = await ModuleService.updateModule(
      module,
      payload,
      recordId,
    );
    if (response && response.data) {
      message.success('Updated successfully !!');
      setEditModal(false);
      const index = findIndex(data, item => item._id === recordId);
      data[index] = response.data;
      setData([...data]);
    }
  };

  return (
    <div>
      <ButtonWrapper>
        {showBulkButton && (
          <PrimaryButton
            style={{ marginRight: '10px' }}
            icon={<PlusOutlined />}
            width="150px"
            onClick={props.bulkUploadHandle}
          >
            Bulk Upload
          </PrimaryButton>
        )}
        <PrimaryButton
          icon={<PlusOutlined />}
          onClick={showAddModal}
          width="120px"
        >
          Add
        </PrimaryButton>
      </ButtonWrapper>
      <StyledTable
        {...props}
        columns={columnCache}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        onChange={pageChange}
        pagination={pagination}
      />
      {props.formComponent && (
        <Modal
          title={`Add ${addText || module}`}
          visible={addModalVisible}
          onCancel={() => setAddModal(false)}
          footer={null}
          width={modalWidth || 400}
        >
          {React.cloneElement(props.formComponent, {
            onAddSuccess,
          })}
        </Modal>
      )}

      {props.formComponent && (
        <Modal
          title={`Edit ${addText || module}`}
          visible={editModalVisible}
          onCancel={() => setEditModal(false)}
          footer={null}
          width={modalWidth || 400}
        >
          {React.cloneElement(props.formComponent, {
            record: editContent,
            afterEditSubmit,
          })}
        </Modal>
      )}

      {props.contentHideComponent && (
        <Modal
          visible={contentHiddenModal}
          footer={null}
          onCancel={() => setContentHiddenModal(false)}
        >
          {React.cloneElement(props.contentHideComponent, {
            record: selectedData,
            afterHideContentSuccess,
          })}
        </Modal>
      )}
    </div>
  );
}

CustomTable.propTypes = {
  columns: PropTypes.array,
  module: PropTypes.string,
  onAddClick: PropTypes.func,
  handleAddButtonClick: PropTypes.func,
  addData: PropTypes.object,
  formComponent: PropTypes.any,
  modalWidth: PropTypes.string,
  populationKey: PropTypes.any,
  openCreatePage: PropTypes.bool,
  showBulkButton: PropTypes.bool,
  bulkUploadHandle: PropTypes.func,
  showViewIcon: PropTypes.bool,
  addText: PropTypes.string,
  contentHideComponent: PropTypes.any,
  showPublishedButtons: PropTypes.bool,
  noEdit: PropTypes.bool,
};

export default memo(CustomTable);

const TextSuccess = styled.span`
  color: ${colors.primarySuccess};
`;
