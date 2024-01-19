import routeConfigs from '../route.config';

export const getTabMapping = () => {
  const result: Record<string, any> = {};

  routeConfigs.forEach(route => {
    result[route.path] = route.title;
  });

  return result;
};