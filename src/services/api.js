// API基础URL
const BASE_URL = 'http://localhost:8080/api';

// 活动相关API
export const activityAPI = {
  // 获取活动列表
  getActivities() {
    return fetch(`${BASE_URL}/activities`)
      .then(response => {
        if (!response.ok) {
          throw new Error('获取活动列表失败');
        }
        return response.json();
      });
  },

  // 创建新活动
  createActivity(activity) {
    return fetch(`${BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    }).then(response => {
      if (!response.ok) {
        throw new Error('创建活动失败');
      }
      return response.json();
    });
  },

  // 更新活动
  updateActivity(id, activity) {
    return fetch(`${BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    }).then(response => {
      if (!response.ok) {
        throw new Error('更新活动失败');
      }
      return response.json();
    });
  },

  // 删除活动
  deleteActivity(id) {
    return fetch(`${BASE_URL}/activities/${id}`, {
      method: 'DELETE',
    }).then(response => {
      if (!response.ok) {
        throw new Error('删除活动失败');
      }
      return response.json();
    });
  },

  // 获取活动报名列表
  getRegistrations(activityId) {
    return fetch(`${BASE_URL}/activities/${activityId}/registrations`)
      .then(response => {
        if (!response.ok) {
          throw new Error('获取报名列表失败');
        }
        return response.json();
      });
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
      },
      body: JSON.stringify({ status }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('更新报名状态失败');
      }
      return response.json();
    });
  },
};

// 志愿者相关API
export const volunteerAPI = {
  // 获取志愿者列表
  getVolunteers() {
    return fetch(`${BASE_URL}/volunteers`)
      .then(response => {
        if (!response.ok) {
          throw new Error('获取志愿者列表失败');
        }
        return response.json();
      });
  },

  // 创建新志愿者
  createVolunteer(volunteer) {
    return fetch(`${BASE_URL}/volunteers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteer),
    }).then(response => {
      if (!response.ok) {
        throw new Error('创建志愿者失败');
      }
      return response.json();
    });
  },

  // 更新志愿者
  updateVolunteer(id, volunteer) {
    return fetch(`${BASE_URL}/volunteers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteer),
    }).then(response => {
      if (!response.ok) {
        throw new Error('更新志愿者失败');
      }
      return response.json();
    });
  },

  // 删除志愿者
  deleteVolunteer(id) {
    return fetch(`${BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
    }).then(response => {
      if (!response.ok) {
        throw new Error('删除志愿者失败');
      }
      return response.json();
    });
  },
};
