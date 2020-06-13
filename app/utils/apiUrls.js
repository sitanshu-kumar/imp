const ApiUrls = {
  login: () => `v1/admins/login`,
  register: (email, password) =>
    `sign-up.php?email=${email}&password=${password}&language=EN&rewardful=undefined`,
  forgotPassword: email => `reset-forgot-pwd.php?email=${email}`,
  resetPassword: (userId, password) =>
    `set-new-pwd.php?id=${userId}&password=${password}`,
  changePassword: userId => `v1/admins/changePassword/${userId}`,
  mediaUpload: `v1/admins/media/upload`,
  mediaUploadBase64: `v1/admins/media/upload/base64`,
  topicsBulkUpload: `v1/admin/topics/bulk`,
  adminNotifications: `v1/admin/adminNotifications`,
};

export { ApiUrls };
