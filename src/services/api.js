// API基础URL
const BASE_URL = 'http://localhost:8080/api';

// 从localStorage获取token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 统一处理响应
const handleResponse = async (response) => {
  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (error) {
      console.error('Failed to parse error response:', error);
      throw new Error('网络请求失败，请稍后重试');
    }
    throw new Error(error.message || '请求失败');
  }

  const data = await response.json();
  if (!data) {
    throw new Error('服务器返回数据异常');
  }
  return data;
};

// 认证相关API
export const authAPI = {
  // 用户登录
  login(username, password) {
    return fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then(handleResponse);
  },

  // 用户注册
  register(data) {
    return fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // 修改密码
  changePassword(oldPassword, newPassword) {
    return fetch(`${BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      }),
    }).then(handleResponse);
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户列表
  getUsers() {
    return fetch(`${BASE_URL}/users`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 删除用户
  deleteUser(id) {
    return fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 更新用户状态
  updateUserStatus(id, status) {
    return fetch(`${BASE_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    }).then(handleResponse);
  },
};

// 活动相关API
export const activityAPI = {
  // 获取可报名活动列表（志愿者）
  getActivities() {
    return fetch(`${BASE_URL}/activities`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 获取所有活动列表（管理员）
  getAllActivities() {
    return fetch(`${BASE_URL}/admin/activities`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 创建新活动
  createActivity(activity) {
    return fetch(`${BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(activity),
    }).then(handleResponse);
  },

  // 更新活动
  updateActivity(id, activity) {
    return fetch(`${BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(activity),
    }).then(handleResponse);
  },

  // 删除活动
  deleteActivity(id) {
    return fetch(`${BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 获取活动报名列表
  getRegistrations(activityId) {
    return fetch(`${BASE_URL}/activities/${activityId}/registrations`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },
};

// 报名相关API
export const registrationAPI = {
  // 更新报名状态
  updateStatus(id, status) {
    return fetch(`${BASE_URL}/registrations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    }).then(handleResponse);
  },
};

// 志愿者相关API
export const volunteerAPI = {
  // 获取志愿者个人信息
  getMyInfo() {
    return fetch(`${BASE_URL}/volunteer/my-info`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 更新志愿者个人信息
  updateMyInfo(info) {
    return fetch(`${BASE_URL}/volunteer/my-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(info),
    }).then(handleResponse);
  },
  // 获取志愿者列表
  getVolunteers() {
    return fetch(`${BASE_URL}/volunteers`, {
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

  // 创建新志愿者
  createVolunteer(volunteer) {
    return fetch(`${BASE_URL}/volunteers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(volunteer),
    }).then(handleResponse);
  },

  // 更新志愿者
  updateVolunteer(id, volunteer) {
    return fetch(`${BASE_URL}/volunteers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(volunteer),
    }).then(handleResponse);
  },

  // 删除志愿者
  deleteVolunteer(id) {
    return fetch(`${BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }).then(handleResponse);
  },

};
