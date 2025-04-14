"use client";

import {
  addNewUser,
  deleteUser,
  fetchSingleUser,
  fetchUsers,
  updateUser,
} from "@/actions";
import React, { useEffect, useState } from "react";

export default function page() {
  const [fetchUserList, setFetchUserList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const response = editData?.data?._id
        ? await updateUser(editData?.data?._id, formData)
        : await addNewUser(formData);
      if (response?.success) {
        setFormData({ name: "", email: "", address: "" });
        setEditData(null);
        userList();
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  const userList = async () => {
    const response = await fetchUsers();
    setFetchUserList(response);
  };

  useEffect(() => {
    userList();
  }, []);

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    userList();
  };

  const handleEditUser = async (id) => {
    const response = await fetchSingleUser(id);
    setFormData({
      name: response?.data?.name,
      email: response?.data?.email,
      address: response?.data?.address,
    });
    setEditData(response);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <form onSubmit={handleForm} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Enter name"
          name="name"
          value={formData?.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={formData?.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter address"
          name="address"
          value={formData?.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchUserList?.data?.length > 0 ? (
              fetchUserList?.data?.map((v, index) => (
                <tr key={index} className="border-t border-gray-300">
                  <td className="px-4 py-2">{v?.name}</td>
                  <td className="px-4 py-2">{v?.email}</td>
                  <td className="px-4 py-2">{v?.address}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditUser(v?._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(v?._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
