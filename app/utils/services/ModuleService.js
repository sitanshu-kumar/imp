import * as api from '../api';
import { ApiUrls } from '../apiUrls';

class ModuleService {
  getModule = (module, payload) => {
    let path = `v1/admin/${module}`;
    let i = 0;
    for (const key in payload) {
      const val =
        typeof payload[key] === 'object'
          ? JSON.stringify(payload[key])
          : payload[key];
      if (i === 0) {
        path += `?${key}=${val}`;
      } else {
        path += `&${key}=${val}`;
      }
      i++;
    }
    return api.request('get', path);
  };

  getModuleById = (module, id) => {
    api.request('get', `v1/admin/${module}/${id}`);
  };

  deleteModuleId = (module, itemId) =>
    api.request('delete', `v1/admin/${module}/${itemId}`);

  addModule = (module, payload) =>
    api.request('post', `v1/admin/${module}`, payload);

    

  updateModule = (module, payload, itemId) =>
    api.request('put', `v1/admin/${module}/${itemId}`, payload);
}

export default new ModuleService();
