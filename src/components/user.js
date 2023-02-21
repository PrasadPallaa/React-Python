import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import "./DataTableDemo.css";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";

const perPage = 10;

export default function User() {
  const toast = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    country: "",
    status: "",
  });

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:8000/users", {
        params: {
          page,
          first,
          per_page: perPage,
          sort_by: sortBy,
          sort_order: sortOrder,
          filter_by: filterBy,
          filter_value: filterValue,
          global_filter: globalFilter,
        },
      });
      setCustomers(response.data.users);
      setTotalRecords(response.data.total_count.toString()); // update totalRecords with actual count
      setLoading(false);
    }
    fetchData();
  }, [
    page,
    sortBy,
    sortOrder,
    filterBy,
    filterValue,
    first,
    globalFilter,
    filters,
  ]);

  const onClear = (event) => {
    const _filters = { ...filters };
    delete _filters[event.field];
    setFilters(_filters);
  };

  const renderFilter = (column) => {
    if (column.field === "name") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    if (column.field === "email") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    if (column.field === "age") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    if (column.field === "city") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    if (column.field === "country") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    if (column.field === "status") {
      return (
        <input
          value={filters[column.field] || ""}
          onChange={(e) =>
            onFilter({ field: column.field, filterValue: e.target.value })
          }
        />
      );
    }
    // add filters for other columns
    return null;
  };

  const onFilter = (event) => {
    setFilterBy(event.field);
    setFilterValue(event.filterValue);
    const _filters = { ...filters };
    _filters[event.field] = event.filterValue;
    setFilters(_filters);
  };

  const handleSort = (event) => {
    console.log(event);
    const { sortField, sortOrder } = event;
    setSortBy(sortField);
    setSortOrder(sortOrder === 1 ? "asc" : "desc");
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setPage(event.page + 1);
    setCurrentPage(event.first / perPage);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <Button
          label="Add User"
          className="p-button-info mr-2"
          onClick={() => setVisible(true)}
        />

        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            // value={globalFilterValue}
            // onChange={onGlobalFilterChange}
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("http://localhost:8000/users", formData, {
      params: {
        page: Math.ceil(totalRecords / perPage),
        limit: perPage,
      },
    });

    setCustomers(response.data.users);
    setTotalRecords(response.data.total_users); // update totalRecords with actual count

    setVisible(false);
    setFormData({
      name: "",
      email: "",
      age: "",
      city: "",
      country: "",
      status: "",
    });
  };

  const handleUpdate = async (updatedItem) => {
    const response = await axios.put(
      `http://localhost:8000/users/${updatedItem._id}`,
      updatedItem,
      { params: { page, limit: perPage } }
    );

    setCustomers(response.data.users);
    setTotalRecords(response.data.total_users); // update totalRecords with actual count
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`http://localhost:8000/users/${id}`, {
      params: { page, limit: perPage },
    });

    setCustomers(response.data.users);
    setTotalRecords(response.data.total_users); // update totalRecords with actual count
  };

  const handleInputChange = (event) => {
    // setFilterValue(event.target.value);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const confirmDelete = (id) => {
    confirmPopup({
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        // Pass the id parameter to the accept function
        accept(id);
      },
      reject,
    });
  };

  const accept = (id) => {
    handleDelete(id);
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const onRowEditComplete = (e) => {
    let { newData } = e;
    handleUpdate(newData);
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.target.value);
        }}
      />
    );
  };

  const actionRenderer = (rowData, column) => {
    return (
      <div>
        <i
          className="pi pi-trash"
          style={{ fontSize: "1rem" }}
          onClick={() => confirmDelete(rowData._id)}
        ></i>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="datatable-filter-demo">
      <Dialog
        header="User form"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="name" className="p-col-12 p-md-2">
              Name:
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="email" className="p-col-12 p-md-2 mt-3">
              Email:
            </label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="age" className="p-col-12 p-md-2 mt-3">
              Age:
            </label>
            <InputText
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="city" className="p-col-12 p-md-2 mt-3">
              City:
            </label>
            <InputText
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="country" className="p-col-12 p-md-2 mt-3">
              Country:
            </label>
            <InputText
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field" style={{ marginLeft: "-5rem" }}>
            <label htmlFor="country" className="p-col-12 p-md-2 mt-3">
              Status:
            </label>
            <InputText
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
          <Button
            type="submit"
            label="Submit"
            style={{ float: "right", marginTop: "10px" }}
          />
        </form>
      </Dialog>
      <Toast ref={toast} />
      <ConfirmPopup />
      <div className="card">
        <DataTable
          value={customers}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          className="p-datatable-customers"
          dataKey="id"
          filterDisplay="row"
          loading={loading}
          responsiveLayout="scroll"
          header={header}
          emptyMessage="No customers found."
          globalFilter={globalFilter}
          onFilter={onFilter}
          onClear={onClear}
          // onSort={handleSort}
          sortField={sortBy}
          sortOrder={sortOrder}
          onSort={(e) => {
            handleSort(e);
          }}
        >
          <Column
            field="name"
            header="Name"
            filter
            filterPlaceholder="Search by age"
            style={{ minWidth: "12rem" }}
            editor={(options) => textEditor(options)}
            filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
            sortable
          />
          <Column
            field="email"
            header="Email"
            style={{ minWidth: "12rem" }}
            filter
            filterPlaceholder="Search by email"
            editor={(options) => textEditor(options)}
            sortable
            // filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
          />
          <Column
            field="age"
            header="Age"
            filter
            filterPlaceholder="Search by age"
            style={{ minWidth: "12rem" }}
            editor={(options) => textEditor(options)}
            sortable
            filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
          />
          <Column
            field="country"
            header="Country"
            filter
            filterPlaceholder="Search by country"
            style={{ minWidth: "12rem" }}
            editor={(options) => textEditor(options)}
            sortable
            filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
          />
          <Column
            field="city"
            header="City"
            filter
            filterPlaceholder="Search by city"
            style={{ minWidth: "12rem" }}
            editor={(options) => textEditor(options)}
            sortable
            filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
          />
          <Column
            field="status"
            header="Status"
            filter
            filterPlaceholder="Search by status"
            style={{ minWidth: "12rem" }}
            editor={(options) => textEditor(options)}
            sortable
            filterMatchMode={FilterMatchMode.CONTAINS}
            filterElement={renderFilter}
          />
          <Column
            rowEditor
            header="Actions"
            headerStyle={{ width: "1%" }}
            bodyStyle={{ textAlign: "left" }}
          ></Column>
          <Column
            bodyStyle={{ textAlign: "left" }}
            body={actionRenderer}
          ></Column>
        </DataTable>
        <Paginator
          first={currentPage * perPage}
          rows={perPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          alwaysShow={true}
        />
      </div>
    </div>
  );
}
